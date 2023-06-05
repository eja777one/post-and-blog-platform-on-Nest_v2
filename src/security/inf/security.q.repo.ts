import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Device } from "../dom/device.entity";
import { errorHandler } from "../../application/error.handler";
import { DeviceViewModel } from "../security.types";

@Injectable()
export class SecurityQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  };

  async getSessionByDeviceIdSQL(deviceId: string) {
    try {
      const session = await this.dataSource
        .getRepository(Device)
        .createQueryBuilder("d")
        .where("d.deviceId = :deviceId", { deviceId })
        .getOne();
      return session;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUsersSessionsSQL(userId: string): Promise<DeviceViewModel[]> {
    try {
      const sessions = await this.dataSource
        .getRepository(Device)
        .createQueryBuilder("d")
        .select("d.ip", "ip")
        .addSelect("d.deviceName", "title")
        .addSelect("d.createdAt", "lastActiveDate")
        .addSelect("d.deviceId", "deviceId")
        .where("d.userId = :userId", { userId })
        .getRawMany();
      return sessions;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getTokenMetaSQL(userId: string, deviceId: string) {
    try {
      const session = await this.dataSource
        .getRepository(Device)
        .createQueryBuilder("d")
        .where("d.userId = :userId AND d.deviceId = :deviceId",
          { userId, deviceId })
        .getOne();
      return session;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async checkSessionSQL(ip: string, deviceName: string, userId: string) {
    try {
      const session = await this.dataSource
        .getRepository(Device)
        .createQueryBuilder("d")
        .where("d.ip = :ip AND d.deviceName = :deviceName " +
          "AND d.userId = :userId", { ip, deviceName, userId })
        .getOne();
      return session;
    } catch (e) {
      return errorHandler(e);
    }
  };
};