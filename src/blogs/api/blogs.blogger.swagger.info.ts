import { HttpStatus } from "@nestjs/common";
import { Paginator } from "../../types";
import { BlogsImagesViewModel, BlogViewModel, PostImagesViewModel, sw_Paginator_BlogViewModel } from "../blogs.types";
import { PostViewModel } from "../../posts/posts.types";
import { CommentWithPostViewModel, sw_Paginator_CommentWithPostViewModel } from "../../comments/comments.types";
import {
  badRequestError, pageNumber, pageSize, searchNameTerm, sortBy, sortDirection,
  UnauthorizedError
} from "../../swagger.info";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "Blog was not found"
};

const ForbiddenError = {
  status: HttpStatus.FORBIDDEN,
  description: "Blogger try to manipulate with not own blog (update, delete, " +
    "add post, etc...)"
};

export const sw_uploadWallpaper = {
  summary: {
    summary: "Upload background wallpaper for Blog (.png or .jpg/.jpeg)" +
      " file (max size is 100KB, width must be 1028px, height must be 312px) "
  },
  status201: {
    status: HttpStatus.CREATED,
    description: "Wallpaper was uploaded",
    type: BlogsImagesViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status403: ForbiddenError
};

export const sw_uploadMainImage = {
  summary: {
    summary: "Upload main square image for Blog (.png or .jpg/.jpeg)" +
      " file (max size is 100KB, width must be 156px, height must be 156px) "
  },
  status201: {
    status: HttpStatus.CREATED,
    description: "Wallpaper was uploaded",
    type: BlogsImagesViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status403: ForbiddenError
}

export const sw_uploadPostMainImage = {
  summary: {
    summary: "Upload main image for Post (.png or .jpg/.jpeg)" +
      " file (max size is 100KB, width must be 940px, height must be 432px) "
  },
  status201: {
    status: HttpStatus.CREATED,
    description: "Wallpaper was uploaded",
    type: PostImagesViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status403: ForbiddenError
}

export const sw_createBlog = {
  summary: { summary: "Blogger can create new blog" },
  status201: {
    status: HttpStatus.CREATED,
    description: "Blog was created",
    type: BlogViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError
};

export const sw_updateBlog = {
  summary: { summary: "Blogger can update own blog" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Blog was updated"
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status403: ForbiddenError
};

export const sw_deleteBlog = {
  summary: { summary: "Blogger can delete own blog" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Blog was deleted"
  },
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};

export const sw_createBlogsPosts = {
  summary: { summary: "Blogger can create post for own blog" },
  status201: {
    status: HttpStatus.CREATED,
    description: "Post was created",
    type: PostViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};

export const sw_updateBlogsPosts = {
  summary: { summary: "Blogger can update own post for own blog" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Post was updated"
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};

export const sw_deleteBlogsPosts = {
  summary: { summary: "Blogger can delete own post for own blog" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Post was deleted"
  },
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};

export const sw_getBlogs = {
  summary: { summary: "Blogger can get all own blogs" },
  searchNameTerm: searchNameTerm,
  sortBy: {
    ...sortBy,
    description: "Sorting blogs by param (default: createdAt)"
  },
  sortDirection: {
    ...sortDirection,
    description: "Show blogs with sortDirection (default: desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show blogs with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show blogs with pass pageSize (default: 10)"
  },
  status200: {
    status: HttpStatus.OK,
    description: "Blogger's blogs was returned",
    type: sw_Paginator_BlogViewModel
  },
  status401: UnauthorizedError
};

export const sw_getBloggerBlogComments = {
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
  summary: {
    summary: "Return all comments for posts, which link with blogs," +
      " which owner is blogger"
  },
  status200: {
    status: HttpStatus.OK,
    description: "Comments was returned",
    type: sw_Paginator_CommentWithPostViewModel
  },
  status401: UnauthorizedError
};