import { Injectable } from "@nestjs/common";
import { BlogInputModel } from "../blogs.types";
import { UserViewModel } from "../../users/users.types";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Blog } from "../dom/blog.entity";
import { BlogOwnerInfo } from "../dom/blog.entity.owner.info";
import { BlogBanInfo } from "../dom/blog.entity.ban.info";
import { errorHandler } from "../../application/error.handler";
import { BlogImage } from "../dom/blog.entity.images";

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BlogOwnerInfo) private readonly blogOwnerInfoRepo:
      Repository<BlogOwnerInfo>,
    @InjectRepository(BlogBanInfo) private readonly blogBanInfoRepo:
      Repository<BlogBanInfo>,
    @InjectRepository(BlogImage) private readonly blogImageRepo:
      Repository<BlogImage>
  ) {
  };

  async getImageInfo(blogId: string, type: string) {
    try {
      const imageInfo = await this.blogImageRepo
        .findOneBy({ blogId, type });
      return imageInfo;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getBlog(id: string) {
    try {
      const blog = await this.blogRepo.findOneBy({ id });
      return blog;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveBlog(blog: Blog) {
    try {
      await this.blogRepo.save(blog);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveBlogImage(blogImage: BlogImage) {
    try {
      await this.blogImageRepo.save(blogImage);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getBlogOwnerInfo(blogId: string) {
    try {
      const blogOwnerInfo = await this.blogOwnerInfoRepo
        .findOneBy({ blogId });
      return blogOwnerInfo;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveBlogOwnerInfo(blogOwnerInfo: BlogOwnerInfo) {
    try {
      await this.blogOwnerInfoRepo.save(blogOwnerInfo);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getBlogBanInfo(blogId: string) {
    try {
      const blogOwnerInfo = await this.blogBanInfoRepo
        .findOneBy({ blogId });
      return blogOwnerInfo;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveBlogBanInfo(blogBanInfo: BlogBanInfo) {
    try {
      await this.blogBanInfoRepo.save(blogBanInfo);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteBlog(id: string) {
    try {
      await this.blogRepo.delete(id);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllSQL() {
    try {
      await this.dataSource.query(`TRUNCATE "blog", 
      "blog_owner_info", "blog_ban_info" CASCADE;`);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async createBlogSQL(blogInput: BlogInputModel, user?: UserViewModel) {
  //   const blogId = uuidv4();
  //   try {
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(Blog)
  //       .values({
  //         id: blogId,
  //         name: blogInput.name,
  //         description: blogInput.description,
  //         websiteUrl: blogInput.websiteUrl,
  //         createdAt: new Date().toISOString()
  //         // isMembership: false
  //       })
  //       .execute();
  //
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(BlogOwnerInfo)
  //       .values({
  //         blogId: blogId,
  //         userId: user?.id ? user.id : null
  //       })
  //       .execute();
  //
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(BlogBanInfo)
  //       .values({
  //         // isBanned: false,
  //         // banDate: null,
  //         blogId: blogId
  //       })
  //       .execute();
  //     return blogId;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async updateBlogSQL(blogInput: BlogInputModel, blogId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(Blog)
  //       .set({
  //         name: blogInput.name,
  //         description: blogInput.description,
  //         websiteUrl: blogInput.websiteUrl
  //       })
  //       .where("id = :blogId", { blogId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async bindBlogWithUserSQL(userId: string, blogId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(BlogOwnerInfo)
  //       .set({ userId })
  //       .where("blogId = :blogId", { blogId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async setBanStatusSQL(isBanned: boolean, blogId: string) {
  //   const banDate = isBanned ? new Date().toISOString() : null;
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(BlogBanInfo)
  //       .set({ isBanned, banDate })
  //       .where("blogId = :blogId", { blogId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteBlogSQL(id: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Blog)
  //       .where("id = :id", { id })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };
};