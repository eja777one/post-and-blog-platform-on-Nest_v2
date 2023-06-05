import { HttpStatus } from "@nestjs/common";
import { APIErrorResult } from "./types";

export const sortBy = { name: "sortBy", type: String, required: false };
export const pageNumber = { name: "pageNumber", type: Number, required: false };
export const sortDirection = {
  name: "sortDirection",
  type: String,
  required: false,
  enum: ["acs", "desc"]
};
export const pageSize = { name: "pageSize", type: Number, required: false };

export const badRequestError = {
  status: HttpStatus.BAD_REQUEST,
  description: "Request body has error(s)",
  type: APIErrorResult
};

export const UnauthorizedError_1 = {
  status: HttpStatus.UNAUTHORIZED,
  description: "Incorrect login or password"
};

export const UnauthorizedError_2 = {
  status: HttpStatus.UNAUTHORIZED,
  description: "Incorrect Refresh token (missing, expired or incorrect)"
};

export const UnauthorizedError = {
  status: HttpStatus.UNAUTHORIZED,
  description: "Unauthorized"
};

export const tooManyRequestError = {
  status: HttpStatus.TOO_MANY_REQUESTS,
  description: "More than 5 request from one ip in 10 seconds"
};

export const searchNameTerm = {
  name: "searchNameTerm",
  type: String,
  required: false,
  description: "Find term in blog's name (default: null)"
};

export const searchLoginTerm = {
  name: "searchLoginTerm",
  type: String,
  required: false,
  description: "Find term in user's login (default: null)"
};

export const searchEmailTerm = {
  name: "searchEmailTerm",
  type: String,
  required: false,
  description: "Find term in user's email (default: null)"
};

export const bodySearchTerm = {
  name: "bodySearchTerm",
  type: String,
  required: false,
  description: "Find term in question's name (default: null)"
};

export const publishedStatus = {
  name: "publishedStatus",
  type: String,
  required: false,
  description: "Filter by question's published status (default: all)",
  enum: ['all', 'published', 'notPublished']
};