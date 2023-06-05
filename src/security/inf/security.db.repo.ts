import { Injectable } from "@nestjs/common";
import { SessionDTO } from "../security.types";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { add } from "date-fns";
import { Device } from "../dom/device.entity";
import { errorHandler } from "../../application/error.handler";
import { Not } from "typeorm";

@Injectable()
export class SecurityRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>
  ) {
  };

  async saveSession(session: Device) {
    try {
      await this.deviceRepo.save(session);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteSessionBeforeLogin(ip: string, deviceName: string,
                                 userId: string) {
    try {
      await this.deviceRepo.delete({ ip, deviceName, userId });
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteSessionBeforeLogout(userId: string, deviceId: string) {
    try {
      await this.deviceRepo.delete({ deviceId, userId });
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getSession(userId: string, deviceId: string) {
    try {
      const session = await this.deviceRepo.findOneBy({ deviceId, userId });
      return session;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteOtherSessions(userId: string, deviceId: string) {
    try {
      await this.deviceRepo.delete({ userId, deviceId: Not(deviceId) });
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllUsersSessions(userId: string) {
    try {
      await this.deviceRepo.delete({ userId });
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllSQL() {
    try {
      await this.dataSource.query(`TRUNCATE "device" CASCADE;`);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async createSessionSQL(sessionDTO: SessionDTO) {
  //   try {
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(Device)
  //       .values({
  //         userId: sessionDTO.userId,
  //         createdAt: sessionDTO.createdAt,
  //         expiredAt: add(new Date(), { minutes: 60 }).toISOString(),
  //         deviceId: sessionDTO.deviceId,
  //         ip: sessionDTO.ip,
  //         deviceName: sessionDTO.deviceName
  //       })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteSessionBeforeLoginSQL(ip: string, deviceName: string,
  //                                   userId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Device)
  //       .where("ip = :ip AND deviceName = :deviceName " +
  //         "AND userId = :userId", { ip, deviceName, userId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteSessionBeforeLogoutSQL(userId: string, deviceId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Device)
  //       .where("userId = :userId AND deviceId = :deviceId",
  //         { userId, deviceId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async updateSessionSQL(id: string, createdAt: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(Device)
  //       .set({ createdAt: createdAt })
  //       .where("id = :id", { id })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteOtherSessionsSQL(userId: string, deviceId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Device)
  //       .where("userId = :userId AND deviceId NOT LIKE :deviceId",
  //         { userId, deviceId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteThisSessionsSQL(userId: string, deviceId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Device)
  //       .where("userId = :userId AND deviceId = :deviceId",
  //         { userId, deviceId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteAllUsersSessionsSQL(userId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Device)
  //       .where("userId = :userId", { userId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };
};