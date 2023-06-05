import "reflect-metadata";
import { Injectable } from "@nestjs/common";
import { add } from "date-fns";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PassRecovery } from "../dom/pass.rec.entity";
import { errorHandler } from "../../application/error.handler";

@Injectable()
export class PasswordRecoveryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PassRecovery) private readonly passRecoveryRepo:
      Repository<PassRecovery>
  ) {
  };

  async savePassData(passData: PassRecovery) {
    try {
      await this.passRecoveryRepo.save(passData);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deletePasswordData(userId: string) {
    try {
      await this.passRecoveryRepo.delete({ userId });
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getData(passwordRecoveryCode: string) {
    try {
      const data = await this.passRecoveryRepo
        .findOneBy({ passwordRecoveryCode });
      return data;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getCodeData(userId: string) {
    try {
      const data = await this.passRecoveryRepo.findOneBy({ userId });
      return data;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllSQL() {
    try {
      await this.dataSource.query(`TRUNCATE "pass_recovery" CASCADE;`);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async addPassDataSQL(userId: string, passRecCode: string) {
  //   try {
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(PassRecovery)
  //       .values({
  //         userId,
  //         passwordRecoveryCode: passRecCode,
  //         createdAt: new Date().toISOString(),
  //         expiredAt: add(new Date(), { minutes: 10 }).toISOString()
  //       })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async getDataSQL(code: string) {
  //   try {
  //     const data = await this.dataSource
  //       .getRepository(PassRecovery)
  //       .createQueryBuilder("p")
  //       .where("p.passwordRecoveryCode = :code", { code })
  //       .getOne();
  //     return data;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async getCodeSQL(userId: string) {
  //   try {
  //     const data = await this.dataSource
  //       .getRepository(PassRecovery)
  //       .createQueryBuilder("p")
  //       .where("p.userId = :userId", { userId })
  //       .getOne();
  //     return data;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deletePasswordDataSQL(userId: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(PassRecovery)
  //       .where("userId = :userId", { userId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };
};