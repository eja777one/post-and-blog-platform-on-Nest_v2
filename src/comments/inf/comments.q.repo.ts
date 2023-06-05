import { Injectable } from "@nestjs/common";
import { LikeType, Paginator, QueryType } from "../../types";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Comment } from "../dom/comment.entity";
import { UserBanInfo } from "../../users/dom/user.entity.ban.info";
import { CommentLikes } from "../dom/comment.entity.likes";
import { errorHandler } from "../../application/error.handler";
import { CommentViewModel, CommentWithPostViewModel } from "../comments.types";

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  };

  async getViewCommentSQL(id: string, userId?: string)
    :Promise<CommentViewModel> {
    try {
      userId = userId ? userId : id;

      const comment = await this.dataSource
        .getRepository(Comment)
        .createQueryBuilder("c")
        .innerJoinAndSelect("c.user", "u")
        .innerJoinAndMapOne("c.userBanInfo", UserBanInfo, "ubi",
          "ubi.userId = u.id")
        .where("c.id = :id AND ubi.isBanned = false", { id })
        .getOne();

      // console.log(comment);

      const like = await this.dataSource
        .getRepository(CommentLikes)
        .createQueryBuilder("cl")
        .innerJoinAndMapOne("cl.userBanInfo", UserBanInfo, "ubi",
          "ubi.userId = cl.userId AND ubi.isBanned = false")
        .where("cl.commentId = :id AND cl.userId = :userId", { id, userId })
        .getOne();

      // console.log(like);
      // @ts-ignore
      return comment ? formatComment(comment, like?.likeStatus) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getCommentSQL(id: string, userId?: string) {
    try {
      const comment = await this.dataSource
        .getRepository(Comment)
        .createQueryBuilder("c")
        .where("c.id = :id", { id })
        .getOne();
      return comment;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getCommentsSQL(queryForSearch: QueryType, postId: string,
                       userId?: string):Promise<Paginator<CommentViewModel>> {
    try {
      let query = `
        SELECT c."id", c."content", c."userId", u."login",  c."createdAt", 
        c."likesCount", c."dislikesCount", 
        (SELECT cl."likeStatus" as "myStatus" FROM "comment_likes" cl
        JOIN "user_ban_info" bi ON bi."userId" = cl."userId"
        WHERE cl."userId" = $1 AND cl."commentId" = c."id" 
        AND bi."isBanned" = false)
        FROM "comment" c 
        LEFT JOIN "users" u on u."id" = c."userId" 
        JOIN "user_ban_info" bi on bi."userId" = c."userId" 
        WHERE c."postId" = $2 AND c."isHide" = false AND bi."isBanned" = false
        ORDER BY "${queryForSearch.sortBy}" `;

      let userIdParam = userId ? userId : postId;

      const countComments = await this.dataSource.query(query,
        [userIdParam, postId]);

      queryForSearch.sortDirection === "ASC" ? query += " asc" : query += " desc";
      query += " LIMIT $3 OFFSET $4";

      const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

      let comments = await this.dataSource.query(query, [userIdParam,
        postId, queryForSearch.pageSize, skip]);

      return {
        pagesCount: Math.ceil(countComments.length / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: countComments.length,
        items: comments.map(el => formatComment(el, el.myStatus))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getBloggerBlogsCommentsSQL(queryForSearch: QueryType,
                                   bloggerId: string)
    : Promise<Paginator<CommentWithPostViewModel>> {
    try {
      const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

      const query = this.dataSource
        .getRepository(Comment)
        .createQueryBuilder("c")
        .leftJoinAndSelect("c.commentLikes", "cl",
          "cl.userId = :id", { id: bloggerId })
        .innerJoinAndSelect("c.user", "u")
        .innerJoinAndSelect("c.post", "p")
        .innerJoinAndSelect("p.blog", "b")
        .innerJoinAndSelect("b.blogOwnerInfo", "boi")
        .where("boi.userId = :bloggerId", { bloggerId });

      const commentsCount = await query.getCount();

      const comments = await query
        .orderBy(`c.${queryForSearch.sortBy} COLLATE "C"`,
          queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      // console.log(comments);

      return {
        pagesCount: Math.ceil(commentsCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: commentsCount,
        items: comments.map(el => formatComment2(el))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };
};

const formatComment = (rawComment: any, likeStatus?: LikeType)
  : CommentViewModel => {
  return {
    id: rawComment.id,
    content: rawComment.content,
    commentatorInfo: {
      userId: rawComment.userId,
      userLogin: rawComment.login ? rawComment?.login : rawComment.user.login
    },
    createdAt: rawComment.createdAt,
    likesInfo: {
      likesCount: rawComment.likesCount,
      dislikesCount: rawComment.dislikesCount,
      myStatus: likeStatus ? likeStatus : "None"
    }
  };
};

const formatComment2 = (rawComment: any): CommentWithPostViewModel => {
  return {
    id: rawComment.id,
    content: rawComment.content,
    commentatorInfo: {
      userId: rawComment.userId,
      userLogin: rawComment.user.login
    },
    createdAt: rawComment.createdAt,
    likesInfo: {
      likesCount: rawComment.likesCount,
      dislikesCount: rawComment.dislikesCount,
      myStatus: rawComment.commentLikes[0]?.likeStatus ?
        rawComment.commentLikes[0]?.likeStatus : "None"
    },
    postInfo: {
      id: rawComment.post.id,
      title: rawComment.post.title,
      blogId: rawComment.post.blogId,
      blogName: rawComment.post.blog.name
    }
  };
};