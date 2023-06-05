// import { ObjectID } from "bson";

import { ApiProperty } from "@nestjs/swagger";
import { sw_Paginator } from "../types";
import { PostViewModel } from "../posts/posts.types";

export class TokensMetaDBModel {
  constructor(
    // public _id: ObjectID,
    public createdAt: string,
    public expiredAt: string,
    public deviceId: string,
    public ip: string,
    public deviceName: string,
    public userId: string
  ) {
  }
};

export class SessionDTO {
  constructor(
    public createdAt: string,
    public deviceId: string,
    public ip: string,
    public deviceName: string,
    public userId: string
  ) {
  }
};

export class DeviceViewModel {
  @ApiProperty({
    description: "Device's ip",
    nullable: false,
    example: "26.163.103.234"
  })
  ip: string;
  @ApiProperty({
    description: "Device's title",
    nullable: false,
    example: "Chrome"
  })
  title: string;
  @ApiProperty({
    description: "Device's last log in",
    nullable: false,
    example: "2023-05-16T11:46:36.006Z"
  })
  lastActiveDate: string;
  @ApiProperty({
    description: "Device's id",
    nullable: false,
    example: "58a74f93-d443-4203-9889-05098d96b6a3"
  })
  deviceId: string;
};

export class sw_Paginator_DeviceViewModel extends sw_Paginator {
  @ApiProperty({
    description: "Items",
    nullable: false,
    isArray: true,
    type: DeviceViewModel
  })
  @ApiProperty()
  items: DeviceViewModel[];
}