import { HttpStatus } from "@nestjs/common";
import { UnauthorizedError } from "../../swagger.info";
import { DeviceViewModel, sw_Paginator_DeviceViewModel } from "../security.types";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "Device was not found"
};

const ForbiddenError = {
  status: HttpStatus.FORBIDDEN,
  description: "User try to delete not own device"
};

export const sw_getDevices = {
  summary: { summary: "Return all user's sessions (by Refresh token)" },
  status200: {
    status: HttpStatus.OK,
    description: "Session was returned",
    type: sw_Paginator_DeviceViewModel
  },
  status401: UnauthorizedError
};

export const sw_deleteNonCurrentDevices = {
  summary: {
    summary: "Delete all user's sessions without current (by Refresh token)"
  },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Sessions was deleted"
  },
  status401: UnauthorizedError
};

export const sw_deleteDevice = {
  summary: { summary: "Delete current session by deviceId (by Refresh token)" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Session was deleted"
  },
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};