import { HttpStatus } from "@nestjs/common";
import { LoginSuccessViewModel } from "../../types";
import { MeViewModel } from "../../users/users.types";
import {
  badRequestError, tooManyRequestError, UnauthorizedError_1,
  UnauthorizedError_2, UnauthorizedError
} from "../../swagger.info";

export const sw_registration = {
  summary: { summary: "Registration in the system" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "User was added to platform. Email with confirm was sent to user"
  },
  status400: badRequestError,
  status429: tooManyRequestError
};

export const sw_resendEmailConfirm = {
  summary: {
    summary: "Resend email with confirm code to user." +
      " Confirm code inside link"
  },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Email with confirm was sent to user"
  },
  status400: badRequestError,
  status429: tooManyRequestError
};

export const sw_confirmEmail = {
  summary: { summary: "Confirm email to user" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Email was confirmed"
  },
  status400: badRequestError,
  status429: tooManyRequestError
};

export const sw_login = {
  summary: { summary: "User can login into platform" },
  status200: {
    status: HttpStatus.OK,
    description: "Return Access token in body and Refresh token in Cookie",
    type: LoginSuccessViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError_1,
  status429: tooManyRequestError
};

export const sw_refreshTokens = {
  summary: { summary: "User can get new Access and Refresh tokens" },
  status200: {
    status: HttpStatus.OK,
    description: "Return Access token in body and Refresh token in Cookie",
    type: LoginSuccessViewModel
  },
  status401: UnauthorizedError_2
};

export const sw_logout = {
  summary: {
    summary: "User can logout (Access and Refresh tokens will be revoked)"
  },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Access and Refresh tokens will be revoked"
  },
  status401: UnauthorizedError_2
};

export const sw_getMyInfo = {
  summary: { summary: "User can get info about own profile" },
  status200: {
    status: HttpStatus.OK,
    description: "Return info about user",
    type: MeViewModel
  },
  status401: UnauthorizedError
};

export const sw_sendPassRecoveryCode = {
  summary: { summary: "User can send request to set new password" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "If email is exist email with confirmation was sent." +
      " If not just return 204"
  },
  status400: badRequestError,
  status429: tooManyRequestError
};

export const sw_setNewPassword = {
  summary: { summary: "User can set new password, use confirmation" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "New password was set"
  },
  status400: badRequestError,
  status429: tooManyRequestError
};