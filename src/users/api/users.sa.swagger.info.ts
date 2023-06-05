import { HttpStatus } from "@nestjs/common";
import {
  badRequestError, pageNumber, pageSize, searchEmailTerm, searchLoginTerm,
  sortBy, sortDirection, UnauthorizedError
} from "../../swagger.info";
import { Paginator } from "../../types";
import { SAUserViewModel, sw_Paginator_SAUserViewModel } from "../users.types";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "User was not found"
};

export const sw_setBanStatus = {
  summary: { summary: "SA can ban/unban user" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "User was banned/unbanned"
  },
  status400: badRequestError,
  status401: UnauthorizedError
};

export const sw_getUsers = {
  summary: { summary: "Return all users" },
  searchLoginTerm: searchLoginTerm,
  searchEmailTerm: searchEmailTerm,
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
    description: "Users was returned",
    type: sw_Paginator_SAUserViewModel
  },
  status401: UnauthorizedError
};

export const sw_createUser = {
  summary: { summary: "SA can add user" },
  status201: {
    status: HttpStatus.CREATED,
    description: "User was created",
    type: SAUserViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError
};

export const sw_deleteUser = {
  summary: { summary: "SA can delete user" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "User was deleted"
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};