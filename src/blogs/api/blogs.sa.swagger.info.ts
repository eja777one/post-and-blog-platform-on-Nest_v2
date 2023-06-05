import { HttpStatus } from "@nestjs/common";
import { sw_Paginator_BlogViewModel, sw_Paginator_SuperAdminBlogViewModel } from "../blogs.types";
import {
  badRequestError, pageNumber, pageSize, searchNameTerm, sortBy,
  sortDirection, UnauthorizedError
} from "../../swagger.info";

export const sw_setBanStatusForBlog = {
  summary: { summary: "SA can ban/unban blog" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Blog was banned/unbanned"
  },
  status400: badRequestError,
  status401: UnauthorizedError
};

export const sw_bindBlogWithUser = {
  summary: { summary: "SA can bind blog (without owner) with blogger" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Blog was bind"
  },
  status400: {
    ...badRequestError,
    description: "If incorrect URI param or Blog already bind with blogger"
  },
  status401: UnauthorizedError
};

export const sw_getBlogs = {
  summary: { summary: "SA can get all blogs" },
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
    description: "Blogs info was returned",
    type: sw_Paginator_SuperAdminBlogViewModel
  },
  status401: UnauthorizedError
};