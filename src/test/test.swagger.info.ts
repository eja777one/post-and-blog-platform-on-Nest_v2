import { HttpStatus } from "@nestjs/common";
import { UnauthorizedError } from "../swagger.info";
import { PassRecTestViewModel, UserTestViewModel } from "../users/users.types";
import { DeviceViewModel } from "../security/security.types";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "User was not found"
};

export const sw_deleteAllData = {
  summary: { summary: "Delete all data from DB" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "All data was deleted"
  },
  status401: UnauthorizedError
};

export const sw_getUser = {
  summary: { summary: "Get user info by email" },
  status200: {
    status: HttpStatus.OK,
    description: "User info was returned",
    type: UserTestViewModel
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_getUsersSessions = {
  summary: { summary: "Get user's sessions info by userId" },
  status200: {
    status: HttpStatus.OK,
    description: "User's sessions was returned",
    isArray: true,
    type: DeviceViewModel
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_getCodeData = {
  summary: { summary: "Get user's recovery code data" },
  status200: {
    status: HttpStatus.OK,
    description: "Code data was returned",
    type: PassRecTestViewModel
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};