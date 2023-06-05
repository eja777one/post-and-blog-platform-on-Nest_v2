import { HttpStatus } from "@nestjs/common";
import { Paginator } from "../../types";
import { CommentViewModel, sw_Paginator_CommentViewModel } from "../../comments/comments.types";
import {
  badRequestError, pageNumber, pageSize, sortBy, sortDirection,
  UnauthorizedError
} from "../../swagger.info";
import { PostViewModel, sw_Paginator_PostViewModel } from "../posts.types";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "Post was not found"
};

export const sw_changeLikeStatus = {
  summary: { summary: "User can set/unset like/dislike for post" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Like status for post was changed"
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_createPostsComment = {
  summary: { summary: "User can add comment for post" },
  status201: {
    status: HttpStatus.CREATED,
    description: "Comment for post was added",
    type: CommentViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_getPostsComments = {
  sortBy: {
    ...sortBy,
    description: "Sorting comments by param (default: createdAt)"
  },
  sortDirection: {
    ...sortDirection,
    description: "Show comments with sortDirection (default: desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show comments with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show comments with pass pageSize (default: 10)"
  },
  summary: { summary: "Return all comments for post with paging" },
  status200: {
    status: HttpStatus.OK,
    description: "Comments for post was returned",
    type: sw_Paginator_CommentViewModel
  },
  status404: NotFoundError
};

export const sw_getPosts = {
  sortBy: {
    ...sortBy,
    description: "Sorting posts by param (default: createdAt)"
  },
  sortDirection: {
    ...sortDirection,
    description: "Show posts with sortDirection (default: desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show posts with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show posts with pass pageSize (default: 10)"
  },
  summary: { summary: "Return all posts with paging" },
  status200: {
    status: HttpStatus.OK,
    description: "Posts was returned",
    type: sw_Paginator_PostViewModel
  }
};

export const sw_getPost = {
  summary: { summary: "Return post by id" },
  status200: {
    status: HttpStatus.OK,
    description: "Post was returned",
    type: PostViewModel
  },
  status404: NotFoundError
};