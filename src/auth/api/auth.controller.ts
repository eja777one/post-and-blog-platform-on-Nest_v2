import {
  Body, Controller, Get, Post, Res, Req, UnauthorizedException, UseGuards,
  HttpCode
} from "@nestjs/common";
import { Response, Request } from "express";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus } from "@nestjs/cqrs";
import { add } from "date-fns";
import { RegistrationCommand } from "../app/use-cases/create.user.us";
import { ResendConfirmCommand } from "../app/use-cases/resend.confirmation.uc";
import { ConfirmEmailCommand } from "../app/use-cases/confirm.email.uc";
import { LoginCommand } from "../app/use-cases/login.uc";
import { RefreshTokensCommand } from "../app/use-cases/refresh.tokens.uc";
import { DeleteRefTokenCommand } from "../app/use-cases/delete.refresh.token.uc";
import { SendPassRecCodeCommand } from "../app/use-cases/send.pass.rec.code";
import { UpdatePassCommand } from "../app/use-cases/update.pass.uc";
import { JwtAuthGuard } from "../guards/jwt.auth.guard";
import { JwtRefreshAuthGuard } from "../guards/jwt.refresh.auth.guard";
import { URL, HTTP } from "../../types";
import {
  LoginInputModel, MeViewModel, NewPasswordRecoveryInputModel,
  PasswordRecoveryInputModel, RegistrationConfirmationCodeModel,
  RegistrationEmailResending, UserInputModel
} from "../../users/users.types";
import {
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags
} from "@nestjs/swagger";
import {
  sw_confirmEmail, sw_getMyInfo, sw_login, sw_logout, sw_refreshTokens,
  sw_registration, sw_resendEmailConfirm, sw_sendPassRecoveryCode,
  sw_setNewPassword
} from "./auth.swagger.info";

@ApiTags("Auth")
@SkipThrottle()
@Controller(URL + "/auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {
  };

  @SkipThrottle(false)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Post("registration")
  @ApiOperation(sw_registration.summary)
  @ApiResponse(sw_registration.status204)
  @ApiResponse(sw_registration.status400)
  @ApiResponse(sw_registration.status429)
  async registration(@Req() req: Request, @Body() userInput: UserInputModel) {
    await this.commandBus.execute(new RegistrationCommand(userInput, req.ip));
  };

  @SkipThrottle(false)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Post("registration-email-resending")
  @ApiOperation(sw_resendEmailConfirm.summary)
  @ApiResponse(sw_resendEmailConfirm.status204)
  @ApiResponse(sw_resendEmailConfirm.status400)
  @ApiResponse(sw_resendEmailConfirm.status429)
  async resendEmailConfirm(@Body() emailInput: RegistrationEmailResending) {
    await this.commandBus.execute(new ResendConfirmCommand(emailInput.email));
  };

  @SkipThrottle(false)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Post("registration-confirmation")
  @ApiOperation(sw_confirmEmail.summary)
  @ApiResponse(sw_confirmEmail.status204)
  @ApiResponse(sw_confirmEmail.status400)
  @ApiResponse(sw_confirmEmail.status429)
  async confirmEmail(@Body() code: RegistrationConfirmationCodeModel) {
    await this.commandBus.execute(new ConfirmEmailCommand(code.code));
  };

  @SkipThrottle(false)
  @HttpCode(HTTP.OK_200)
  @Post("login")
  @ApiOperation(sw_login.summary)
  @ApiResponse(sw_login.status200)
  @ApiResponse(sw_login.status400)
  @ApiResponse(sw_login.status401)
  @ApiResponse(sw_login.status429)
  async login(@Body() loginInput: LoginInputModel, @Req() req: Request,
              @Res() res: Response) {
    const device = req.headers["user-agent"] ? req.headers["user-agent"]
      : "noDevice";

    const tokens = await this.commandBus.execute(new LoginCommand(
      loginInput.loginOrEmail, loginInput.password, req.ip, device));

    res
      .status(HTTP.OK_200)
      .cookie("refreshToken", tokens.refreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { minutes: 60 })
      })
      .json({ accessToken: tokens.accessToken });
  };

  @UseGuards(JwtRefreshAuthGuard)
  @Post("refresh-token")
  @ApiOperation(sw_refreshTokens.summary)
  @ApiResponse(sw_refreshTokens.status200)
  @ApiResponse(sw_refreshTokens.status401)
  async refreshTokens(@Req() req: Request, @Res() res: Response) {
    const tokens = await this.commandBus.execute(
      new RefreshTokensCommand(req.cookies.refreshToken));

    res
      .status(HTTP.OK_200)
      .cookie("refreshToken", tokens.refreshToken, {
        secure: process.env.NODE_ENV !== "cookie",
        httpOnly: true,
        expires: add(new Date(), { seconds: 20 })
      })
      .json({ accessToken: tokens.accessToken });
  };

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Post("logout")
  @ApiOperation(sw_logout.summary)
  @ApiResponse(sw_logout.status204)
  @ApiResponse(sw_logout.status401)
  async logout(@Req() req: Request) {
    await this.commandBus.execute(
      new DeleteRefTokenCommand(req.cookies.refreshToken));
  };

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiBearerAuth()
  @ApiOperation(sw_getMyInfo.summary)
  @ApiResponse(sw_getMyInfo.status200)
  @ApiResponse(sw_getMyInfo.status401)
  async getMyInfo(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException();
    return new MeViewModel(req.user.email, req.user.login, req.user.id);
  };

  @SkipThrottle(false)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Post("password-recovery")
  @ApiOperation(sw_sendPassRecoveryCode.summary)
  @ApiResponse(sw_sendPassRecoveryCode.status204)
  @ApiResponse(sw_sendPassRecoveryCode.status400)
  @ApiResponse(sw_sendPassRecoveryCode.status429)
  async sendPassRecoveryCode(@Body() passRecInput: PasswordRecoveryInputModel) {
    await this.commandBus.execute(new SendPassRecCodeCommand(passRecInput.email));
  };

  @SkipThrottle(false)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Post("new-password")
  @ApiOperation(sw_setNewPassword.summary)
  @ApiResponse(sw_setNewPassword.status204)
  @ApiResponse(sw_setNewPassword.status400)
  @ApiResponse(sw_setNewPassword.status429)
  async setNewPassword(@Body() newPassInput: NewPasswordRecoveryInputModel) {
    await this.commandBus.execute(new UpdatePassCommand(
      newPassInput.newPassword, newPassInput.recoveryCode));
  };
};