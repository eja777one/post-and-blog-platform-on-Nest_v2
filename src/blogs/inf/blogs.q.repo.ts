import { Injectable } from "@nestjs/common";
import { Paginator, QueryType } from "../../types";
import { BlogsImagesViewModel, BlogViewModel, PhotoSizeViewModel, SuperAdminBlogViewModel } from "../blogs.types";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Blog } from "../dom/blog.entity";
import { Users } from "../../users/dom/users.entity";
import { errorHandler } from "../../application/error.handler";
import { BlogImage } from "../dom/blog.entity.images";

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  };

  async getImageInfo(blogId: string): Promise<BlogsImagesViewModel> {
    try {
      const rawImageInfo = await this.dataSource
        .getRepository(BlogImage)
        .createQueryBuilder("bi")
        .where("bi.blogId = :blogId", { blogId })
        .getMany();
      // console.log(rawImageInfo);
      return rawImageInfo.length !== 0 ? formatImage(rawImageInfo) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getBlogSQL(id: string): Promise<BlogViewModel> | null {
    try {
      const rawBlog = await this.dataSource
        .getRepository(Blog)
        .createQueryBuilder("b")
        .innerJoin("b.blogBanInfo", "bbi")
        .leftJoinAndSelect("b.blogImage", "bi")
        .where("b.id = :id AND bbi.isBanned = false", { id })
        .getOne();
      // console.log(rawBlog);
      return rawBlog ? formatBlog(rawBlog) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getRawBlogSQL(id: string) {
    try {
      const blog = await this.dataSource
        .getRepository(Blog)
        .createQueryBuilder("b")
        .innerJoinAndSelect("b.blogBanInfo", "bbi")
        .innerJoinAndSelect("b.blogOwnerInfo", "boi")
        .leftJoinAndSelect("b.blogImage", "bi")
        .where("b.id = :id", { id })
        .getOne();
      return blog;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getBlogsSQL(queryForSearch: QueryType, userId?: string)
    : Promise<Paginator<BlogViewModel>> {

    const term = queryForSearch.searchNameTerm ?
      `%${queryForSearch.searchNameTerm}%` : `%%`;

    const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

    try {
      const query = this.dataSource
        .getRepository(Blog)
        .createQueryBuilder("b")
        .innerJoin("b.blogOwnerInfo", "boi")
        .innerJoinAndSelect("b.blogImage", "bi")
        .where("boi.userId = :userId AND LOWER(b.name) LIKE LOWER(:term)",
          { userId, term });

      const blogs = await query
        .orderBy(`b.${queryForSearch.sortBy} COLLATE "C"`,
          queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      const blogsCount = await query.getCount();

      return {
        pagesCount: Math.ceil(blogsCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: blogsCount,
        items: blogs.length > 0 ? blogs.map(blog => formatBlog(blog)) : []
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getViewBlogsSQL(queryForSearch: QueryType)
    : Promise<Paginator<BlogViewModel>> {

    const term = queryForSearch.searchNameTerm ?
      `%${queryForSearch.searchNameTerm}%` : `%%`;

    const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

    try {
      const query = this.dataSource
        .getRepository(Blog)
        .createQueryBuilder("b")
        .innerJoin("b.blogBanInfo", "bbi")
        .leftJoinAndSelect("b.blogImage", "bi")
        .where("bbi.isBanned = false AND LOWER(b.name) LIKE LOWER(:term)",
          { term });

      const blogsCount = await query.getCount();

      const blogs = await query
        .orderBy(`b.${queryForSearch.sortBy} COLLATE "C"`,
          queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      return {
        pagesCount: Math.ceil(blogsCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: blogsCount,
        items: blogs.map(blog => formatBlog(blog))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getSuperAdminBlogsSQL(queryForSearch: QueryType)
    : Promise<Paginator<SuperAdminBlogViewModel>> {

    const term = queryForSearch.searchNameTerm ?
      `%${queryForSearch.searchNameTerm}%` : `%%`;

    const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

    try {
      const query = this.dataSource
        .getRepository(Blog)
        .createQueryBuilder("b")
        .innerJoinAndSelect("b.blogOwnerInfo", "boi")
        .innerJoinAndSelect("b.blogBanInfo", "bbi")
        .innerJoinAndMapOne("b.user", Users, "u",
          "boi.userId = u.id")
        .where("LOWER(b.name) LIKE LOWER(:term)", { term });

      const blogs = await query
        .orderBy(`b.${queryForSearch.sortBy} COLLATE "C"`,
          queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      const blogsCount = await query.getCount();

      return {
        pagesCount: Math.ceil(blogsCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: blogsCount,
        items: blogs.map(blog => formatBlogForSA(blog))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };
};

const formatBlog = (rawBlog: any): BlogViewModel => {
  const blog = {
    id: rawBlog.id,
    name: rawBlog.name,
    description: rawBlog.description,
    websiteUrl: rawBlog.websiteUrl,
    createdAt: rawBlog.createdAt,
    isMembership: rawBlog.isMembership,
    images: {
      wallpaper: { url: "none", width: 0, height: 0, fileSize: 0 },
      main: [{ url: "none", width: 0, height: 0, fileSize: 0 }]
    }
  };

  const wallpaper = rawBlog.blogImage?.find(img => img.type === "wallpaper");
  const main = rawBlog.blogImage?.find(img => img.type === "main");

  if (wallpaper) {
    blog.images.wallpaper = {
      url: process.env.STORAGE_URL + wallpaper.url,
      width: wallpaper?.width,
      height: wallpaper?.height,
      fileSize: wallpaper?.fileSize
    };
  }

  if (main) {
    blog.images.main = [{
      url: process.env.STORAGE_URL + main.url,
      width: main?.width,
      height: main?.height,
      fileSize: main?.fileSize
    }];
  }

  return blog;
};

const formatBlogForSA = (rawBlog: any): SuperAdminBlogViewModel => {
  return {
    id: rawBlog.id,
    name: rawBlog.name,
    description: rawBlog.description,
    websiteUrl: rawBlog.websiteUrl,
    createdAt: rawBlog.createdAt,
    isMembership: rawBlog.isMembership,
    blogOwnerInfo: {
      userId: rawBlog.blogOwnerInfo.userId,
      userLogin: rawBlog.user.login
    },
    banInfo: {
      isBanned: rawBlog.blogBanInfo.isBanned,
      banDate: rawBlog.blogBanInfo.banDate
    }
  };
};

const formatImage = (imageInfo: any): BlogsImagesViewModel => {
  let wallpaper: PhotoSizeViewModel;
  let main: PhotoSizeViewModel;

  for (let el of imageInfo) {
    if (el.type === "wallpaper") wallpaper = el;
    if (el.type === "main") main = el;
  }

  return {
    wallpaper: {
      url: wallpaper?.url ? process.env.STORAGE_URL + wallpaper.url : "none",
      width: wallpaper?.width ? wallpaper.width : 0,
      height: wallpaper?.height ? wallpaper.height : 0,
      fileSize: wallpaper?.fileSize ? wallpaper.fileSize : 0
    },
    main: [
      {
        url: main?.url ? process.env.STORAGE_URL + main.url : "none",
        width: main?.width ? main.width : 0,
        height: main?.height ? main.height : 0,
        fileSize: main?.fileSize ? main.fileSize : 0
      }
    ]
  };
};