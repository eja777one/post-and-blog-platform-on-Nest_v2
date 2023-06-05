import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Post } from "../dom/post.entity";
import { PostLikes } from "../dom/post.entity.likes";
import { errorHandler } from "../../application/error.handler";
import { Blog } from "../../blogs/dom/blog.entity";
import { PostInputModelNoId } from "../posts.types";
import { v4 as uuidv4 } from "uuid";
import { LikeStatus } from "../../types";
import { countLike } from "../../application/countLikes";
import { PostImage } from "../dom/post.entity.images";

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(PostLikes) private readonly postLikesRepo:
      Repository<PostLikes>,
    @InjectRepository(PostImage) private readonly postImageRepo:
      Repository<PostImage>
  ) {
  };

  async savePostImage(postImage: PostImage) {
    try {
      await this.postImageRepo.save(postImage);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getImageInfo(postId: string) {
    try {
      const imageInfo = await this.postImageRepo.findOneBy({ postId });
      return imageInfo;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async savePost(post: Post) {
    try {
      await this.postRepo.save(post);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async savePostLike(postLike: PostLikes) {
    try {
      await this.postLikesRepo.save(postLike);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getPost(id: string) {
    try {
      const post = await this.postRepo.findOneBy({ id });
      return post;
    } catch (e) {
      return errorHandler(e);
    }
  }

  async getPostLike(postId: string, userId: string) {
    try {
      const postLike = await this.postLikesRepo.findOneBy(
        { postId, userId });
      return postLike;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deletePost(id: string) {
    try {
      await this.postRepo.delete(id);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async changeBanStatusSQL(userId: string, isBanned: boolean) {
    try {
      const banConf = isBanned ? 1 : -1;

      const query = `UPDATE "post" as p
        SET "dislikesCount" = 
            CASE
            WHEN l."likeStatus" = 'Dislike' THEN "dislikesCount" - 1 * $1
            WHEN l."likeStatus" = 'Like' THEN "dislikesCount"
            END
        ,
            "likesCount" = 
            CASE
            WHEN l."likeStatus" = 'Like' THEN "likesCount" - 1 * $1
            WHEN l."likeStatus" = 'Dislike' THEN "likesCount"
            END
        FROM "post_likes" as l
        WHERE p."id" = l."postId" AND l."userId" = $2`;

      await this.dataSource.query(query, [banConf, userId]);
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllSQL() {
    try {
      await this.dataSource.query(`TRUNCATE "post" CASCADE;`);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async createPostSQL(blogId: string, postInput: PostInputModelNoId,
  //                     userId: string) {
  //   const postId = uuidv4();
  //
  //   try {
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(Post)
  //       .values({
  //         id: postId,
  //         userId: userId,
  //         title: postInput.title,
  //         shortDescription: postInput.shortDescription,
  //         content: postInput.content,
  //         blogId: blogId,
  //         createdAt: new Date().toISOString()
  //         // likesCount: 0,
  //         // dislikesCount: 0,
  //         // isHide: false
  //       })
  //       .execute();
  //     return postId;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async updatePostSQL(postId: string, postInput: PostInputModelNoId) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(Post)
  //       .set({
  //         title: postInput.title,
  //         shortDescription: postInput.shortDescription,
  //         content: postInput.content
  //       })
  //       .where("id = :postId", { postId })
  //       .execute();
  //
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async changeLikeStatusSQL(postId: string, likeStatus: LikeStatus,
  //                           userId: string) {
  //   try {
  //     const post = await this.dataSource
  //       .getRepository(Post)
  //       .createQueryBuilder("p")
  //       // .leftJoinAndSelect("p.postLikes", "pl", `pl.userId = ${userId}`)
  //       .leftJoinAndMapOne("p.like", PostLikes,
  //         "pl", `p.id = pl.postId AND pl.userId = :userId`,
  //         { userId })
  //       .where("p.id = :postId", { postId })
  //       .getOne();
  //
  //     // console.log(post);
  //
  //     let likesCount = post.likesCount;
  //     let dislikesCount = post.dislikesCount;
  //
  //     // @ts-ignore
  //     if (!post.like) {
  //       await this.dataSource.createQueryBuilder()
  //         .insert()
  //         .into(PostLikes)
  //         .values({
  //           postId: postId,
  //           addedAt: new Date().toISOString(),
  //           userId: userId,
  //           likeStatus: likeStatus
  //         })
  //         .execute();
  //
  //       likeStatus === "Like" ? likesCount++ : dislikesCount++;
  //
  //       await this.dataSource
  //         .createQueryBuilder()
  //         .update(Post)
  //         .set({ likesCount, dislikesCount })
  //         .where("id = :postId", { postId })
  //         .execute();
  //
  //       return true;
  //     }
  //
  //     // @ts-ignore
  //     if (post.like.likeStatus === likeStatus) return true;
  //
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(PostLikes)
  //       .set({ addedAt: new Date().toISOString(), likeStatus })
  //       .where("postId = :postId AND userId = :userId",
  //         { postId, userId })
  //       .execute();
  //
  //     // @ts-ignore
  //     const calculateLikes = countLike(post.like.likeStatus, likeStatus,
  //       likesCount, dislikesCount);
  //
  //     likesCount = calculateLikes.likes;
  //     dislikesCount = calculateLikes.dislikes;
  //
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(Post)
  //       .set({ likesCount, dislikesCount })
  //       .where("id = :postId", { postId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deletePostSQL(postId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Post)
  //       .where("id = :postId", { postId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };
};