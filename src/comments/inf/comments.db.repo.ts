import { Injectable } from "@nestjs/common";
import { CommentDTO } from "../comments.types";
import { v4 as uuidv4 } from "uuid";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { LikeStatus } from "../../types";
import { Comment } from "../dom/comment.entity";
import { CommentLikes } from "../dom/comment.entity.likes";
import { countLike } from "../../application/countLikes";
import { errorHandler } from "../../application/error.handler";

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Comment) private readonly commentRepo: Repository<Comment>,
    @InjectRepository(CommentLikes) private readonly commentLikesRepo:
      Repository<CommentLikes>
  ) {
  };

  async saveComment(comment: Comment) {
    try {
      await this.commentRepo.save(comment);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveCommentLike(commentLike: CommentLikes) {
    try {
      await this.commentLikesRepo.save(commentLike);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getComment(id: string) {
    try {
      const comment = await this.commentRepo.findOneBy({ id });
      return comment;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getCommentLike(commentId: string, userId: string) {
    try {
      const commentLike = await this.commentLikesRepo.findOneBy(
        { commentId, userId });
      return commentLike;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteComment(id: string) {
    try {
      await this.commentRepo.delete(id);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async createCommentSQL(commentInput: CommentDTO) {
  //   const commentId = uuidv4();
  //   try {
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(Comment)
  //       .values({
  //         id: commentId,
  //         content: commentInput.content,
  //         userId: commentInput.userId,
  //         createdAt: new Date().toISOString(),
  //         postId: commentInput.postId
  //         // likesCount: 0,
  //         // dislikesCount: 0,
  //         // isHide: false
  //       })
  //       .execute();
  //     return commentId;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async updateCommentSQL(id: string, content: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(Comment)
  //       .set({ content })
  //       .where("id = :id", { id })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteCommentSQL(id: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Comment)
  //       .where("id = :id", { id })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async changeLikeStatusSQL(commentId: string, likeStatus: LikeStatus,
  //                           userId: string) {
  //   try {
  //     const comment = await this.dataSource
  //       .getRepository(Comment)
  //       .createQueryBuilder("c")
  //       .leftJoinAndMapOne("c.like", CommentLikes,
  //         "cl", `c.id = cl.commentId AND cl.userId = :userId`,
  //         { userId })
  //       .where("c.id = :commentId", { commentId })
  //       .getOne();
  //
  //     // console.log(comment);
  //
  //     let likesCount = comment.likesCount;
  //     let dislikesCount = comment.dislikesCount;
  //
  //     // @ts-ignore
  //     if (!comment.like) {
  //       await this.dataSource.createQueryBuilder()
  //         .insert()
  //         .into(CommentLikes)
  //         .values({
  //           commentId: commentId,
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
  //         .update(Comment)
  //         .set({ likesCount, dislikesCount })
  //         .where("id = :commentId", { commentId })
  //         .execute();
  //
  //       return true;
  //     }
  //
  //     // @ts-ignore
  //     if (comment.like?.likeStatus === likeStatus) return true;
  //
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(CommentLikes)
  //       .set({ addedAt: new Date().toISOString(), likeStatus })
  //       .where("commentId = :commentId AND userId = :userId",
  //         { commentId, userId })
  //       .execute();
  //
  //     // @ts-ignore
  //     const calculateLikes = countLike(comment.like.likeStatus, likeStatus,
  //       likesCount, dislikesCount);
  //
  //     likesCount = calculateLikes.likes;
  //     dislikesCount = calculateLikes.dislikes;
  //
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(Comment)
  //       .set({ likesCount, dislikesCount })
  //       .where("id = :commentId", { commentId })
  //       .execute();
  //
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  async changeBanStatusSQL(userId: string, isBanned: boolean) {
    try {
      const banConf = isBanned ? 1 : -1;

      const query = `UPDATE "comment" as c
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
        FROM "comment_likes" as l
        WHERE c."id" = l."commentId" AND l."userId" = $2`;

      await this.dataSource.query(query, [banConf, userId]);

    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllSQL() {
    try {
      await this.dataSource.query(`TRUNCATE "comment", 
      "comment_likes" CASCADE;`);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };
};