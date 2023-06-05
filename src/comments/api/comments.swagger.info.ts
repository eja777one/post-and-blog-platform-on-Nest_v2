import { HttpStatus } from "@nestjs/common";
import { CommentViewModel } from "../comments.types";
import { badRequestError, UnauthorizedError } from "../../swagger.info";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "Comment was not found"
};

const ForbiddenError = {
  status: HttpStatus.FORBIDDEN,
  description: "User try to manipulate with not own comment"
};

export const sw_changeLikeStatus = {
  summary: { summary: "User can set/unset like/dislike" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Comment like status was updated"
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_updateComment = {
  summary: { summary: "User can update own comment" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Comment was updated"
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};

export const sw_deleteComment = {
  summary: { summary: "User can delete own comment" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Comment was deleted"
  },
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};

export const sw_getComment = {
  summary: { summary: "Returned comment by id" },
  status200: {
    status: HttpStatus.OK,
    description: "Comment was returned",
    type: CommentViewModel
  },
  status404: NotFoundError
};