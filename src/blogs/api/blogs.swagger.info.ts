import { HttpStatus } from "@nestjs/common";
import { Paginator } from "../../types";
import { BlogViewModel, sw_Paginator_BlogViewModel } from "../blogs.types";
import { PostViewModel, sw_Paginator_PostViewModel } from "../../posts/posts.types";
import { pageNumber, pageSize, sortBy, sortDirection, UnauthorizedError } from "../../swagger.info";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "Blog was not found"
};

export const sw_unsubscribeFromBlog = {
  summary: {
    summary: "Unsubscribe user from blog. Notification about new posts" +
      " will not send to Telegram Bot"
  },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "User was unsubscribe from blog"
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_subscribeToBlog = {
  summary: {
    summary: "Subscribe user to blog. Notification about new posts" +
      " will be send to Telegram Bot"
  },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "User was subscribe to blog"
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_getBlogs = {
  summary: { summary: "Return all blogs with paging" },
  searchNameTerm: {
    name: "searchNameTerm",
    type: String,
    required: false,
    description: "Find term in blog's name (default: null)"
  },
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
    description: "Blogs was returned",
    // isArray: true,
    type: sw_Paginator_BlogViewModel
  }
};

export const sw_getBlogsPosts = {
  summary: { summary: "Return all blog's posts with paging" },
  sortBy: {
    ...sortBy,
    description: "Sorting blog's posts by param (default: createdAt)"
  },
  sortDirection: {
    ...sortDirection,
    description: "Show blog's posts with sortDirection (default: desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show blog's posts with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show blog's posts with pass pageSize (default: 10)"
  },
  status200: {
    status: HttpStatus.OK,
    description: "Blog's posts was returned",
    type: sw_Paginator_PostViewModel
  },
  status404: NotFoundError
};

export const sw_getBlog = {
  summary: { summary: "Return blog by id" },
  status200: {
    status: HttpStatus.OK,
    description: "Blog was returned",
    type: BlogViewModel
  },
  status404: NotFoundError
};

export const sw_createPostNoBlogger = {
  summary: { summary: "Create blog without link to blog (for test)" },
  status201: {
    status: HttpStatus.CREATED,
    description: "Blog was created",
    type: BlogViewModel
  },
  status404: NotFoundError
};