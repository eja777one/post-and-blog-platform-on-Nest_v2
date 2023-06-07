import { Injectable } from "@nestjs/common";
import { PostViewModel } from "../posts.types";
import { LikeStatus, Paginator, QueryType } from "../../types";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Post } from "../dom/post.entity";
import { BlogBanInfo } from "../../blogs/dom/blog.entity.ban.info";
import { Users } from "../../users/dom/users.entity";
import { UserBanInfo } from "../../users/dom/user.entity.ban.info";
import { errorHandler } from "../../application/error.handler";
import { PostImage } from "../dom/post.entity.images";
import { PhotoSizeViewModel, PostImagesViewModel } from "../../blogs/blogs.types";

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  };

  async getImageInfo(postId: string) {
    try {
      const rawImages = await this.dataSource
        .getRepository(PostImage)
        .createQueryBuilder("pi")
        .where("pi.postId = :postId", { postId })
        .getMany();

      return rawImages.length > 0 ? formatImages(rawImages) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getViewPostsSQL(queryForSearch: QueryType, blogId?: string,
                        userId?: string): Promise<Paginator<PostViewModel>> {

    blogId = blogId ? blogId : "%%";
    const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

    const sortBy = queryForSearch.sortBy === "blogName" ?
      "b.name" : `p.${queryForSearch.sortBy}`;

    try {
      const query = this.dataSource
        .getRepository(Post)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.postLikes", "pl")
        .leftJoinAndSelect("p.postImage", "pi")
        .innerJoinAndSelect("p.blog", "b")
        .innerJoinAndMapOne("p.blogBanInfo", BlogBanInfo,
          "bbi", "bbi.blogId = b.id")
        .leftJoinAndMapMany("p.user", Users,
          "u", "u.id = pl.userId")
        .leftJoinAndMapMany("p.userBanInfo", UserBanInfo,
          "ubi", "ubi.userId = pl.userId")
        .where("b.id::text LIKE (:blogId) AND bbi.isBanned = false", { blogId });

      const postCount = await query.getCount();

      const posts = await query
        .orderBy(sortBy, queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      console.log(posts.length);

      const formatPosts = formatPosts2(posts, userId);

      console.log(formatPosts);

      return {
        pagesCount: Math.ceil(postCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: postCount,
        items: formatPosts
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getViewPostSQL(id: string, userId?: string)
    : Promise<PostViewModel> | null {
    try {
      const rawPosts = await this.dataSource
        .getRepository(Post)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.postLikes", "pl")
        .leftJoinAndSelect("p.postImage", "pi")
        .innerJoinAndSelect("p.blog", "b")
        .innerJoinAndMapOne("p.blogBanInfo", BlogBanInfo,
          "bbi", "bbi.blogId = b.id")
        .leftJoinAndMapMany("p.user", Users,
          "u", "u.id = pl.userId")
        .leftJoinAndMapMany("p.userBanInfo", UserBanInfo,
          "ubi", "ubi.userId = pl.userId")
        .where("p.id = :id AND bbi.isBanned = false", { id })
        .getMany();

      const posts = formatPosts2(rawPosts, userId);

      return posts.length > 0 ? posts[0] : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getPostSQL(id: string): Promise<PostViewModel> | null {
    try {
      const post = await this.dataSource
        .getRepository(Post)
        .createQueryBuilder("p")
        .innerJoinAndSelect("p.blog", "b")
        .leftJoinAndSelect("p.postImage", "pi")
        .where("p.id = :id AND p.isHide = false", { id })
        .getOne();
      return post ? formatPost(post) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };
};

const formatImages = (rawImages: any): PostImagesViewModel => {
  const images: PhotoSizeViewModel[] = [];

  for (let img of rawImages) {
    images.push({
      url: process.env.STORAGE_URL + img.url,
      width: img.width,
      height: img.height,
      fileSize: img.fileSize
    });
  }

  return { main: images };
};

const formatPost = (rawPost: any): PostViewModel => {
  const post: PostViewModel = {
    id: rawPost.id,
    title: rawPost.title,
    shortDescription: rawPost.shortDescription,
    content: rawPost.content,
    blogId: rawPost.blogId,
    blogName: rawPost.blog.name,
    createdAt: rawPost.createdAt,
    extendedLikesInfo: {
      likesCount: rawPost.likesCount,
      dislikesCount: rawPost.dislikesCount,
      myStatus: "None",
      newestLikes: []
    },
    images: { main: [] }
  };

  if (rawPost.postImage.length === 0) return post;

  const images = rawPost.postImage.map(img => ({
    url: process.env.STORAGE_URL + img.url,
    width: img.width,
    height: img.height,
    fileSize: img.fileSize
  }));

  post.images.main = images;
  return post;
};

const formatPosts2 = (rawPosts, userId?): PostViewModel[] => {
  const posts: PostViewModel[] = [];

  for (let post of rawPosts) {
    let myStatus: LikeStatus = "None";

    if (userId) {
      const likeInfo = post.postLikes.find(el => el.userId === userId);
      // console.log(likeInfo);
      if (likeInfo) myStatus = likeInfo.likeStatus;
    }

    const likes = [];

    for (let i = 0; i < post.postLikes.length; i++) {
      if (post.postLikes[i].likeStatus !== "Like") continue;
      if (post.userBanInfo[i].isBanned) continue;
      const like = {
        addedAt: post.postLikes[i].addedAt,
        userId: post.user[i].id,
        login: post.user[i].login
      };
      likes.push(like);
    }

    likes.sort((a, b) => {
      if (a.addedAt < b.addedAt) return 1;
      if (a.addedAt > b.addedAt) return -1;
      return 0;
    });

    if (likes.length > 3) likes.length = 3;

    const obj = formatPost(post);
    obj.extendedLikesInfo.newestLikes = likes;
    obj.extendedLikesInfo.myStatus = myStatus;

    posts.push(obj);
  }
  return posts;
};