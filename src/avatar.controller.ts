import { SkipThrottle } from "@nestjs/throttler";
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { URL } from "./types";
import { join } from "node:path";
import { readTextFileAsync } from "./utils/fs-utils";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiExcludeEndpoint } from "@nestjs/swagger";

// import { saveAvatarCommand } from "./sava.avatar.uc";

@SkipThrottle()
@Controller(URL + "/avatars")
export class AvatarController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @Get("change-page")
  @ApiExcludeEndpoint()
  async changeAvatarPage() {
    const data = await readTextFileAsync(
      join("views", "avatar", "change-page.html"));
    return data;
  };

  //
  // @Post()
  // @UseInterceptors(FileInterceptor("avatar"))
  // async updateAvatar(@UploadedFile() avatarFile: Express.Multer.File) {
  //   await this.commandBus.execute(
  //     new saveAvatarCommand(avatarFile.originalname, avatarFile.buffer));
  //
  //   return "avatar saved";
  // }
};