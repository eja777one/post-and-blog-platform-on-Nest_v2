import { HttpStatus } from "@nestjs/common";
import {
  badRequestError,
  pageNumber, pageSize, searchLoginTerm,
  searchNameTerm,
  sortBy,
  sortDirection,
  UnauthorizedError
} from "../../swagger.info";
import { Paginator } from "../../types";
import { BloggerUserViewModel, sw_Paginator_BloggerUserViewModel } from "../users.types";

export const sw_setBanStatusByBlogger = {
  summary: { summary: "Bun/unban user by blogger" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "User was banned/unbanned"
  },
  status400: badRequestError,
  status401: UnauthorizedError
};

export const sw_getBlogsBannedUsers = {
  summary: { summary: "Return all banned users for blog" },
  searchLoginTerm: searchLoginTerm,
  sortBy: {
    ...sortBy,
    description: "Sorting users by param (default: createdAt)"
  },
  sortDirection: {
    ...sortDirection,
    description: "Show users with sortDirection (default: desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show users with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show users with pass pageSize (default: 10)"
  },
  status200: {
    status: HttpStatus.OK,
    description: "Banned users was returned",
    type: sw_Paginator_BloggerUserViewModel
  },
  status401: UnauthorizedError
};