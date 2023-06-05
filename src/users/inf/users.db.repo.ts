import { Injectable } from "@nestjs/common";
import { BloggerBanUserInputModel, UserDTO } from "../users.types";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { Users } from "../dom/users.entity";
import { UserEmailConfirmation } from "../dom/user.entity.email.confirmation";
import { UserBanInfo } from "../dom/user.entity.ban.info";
import { UserSentEmails } from "../dom/user.entity.sent.emails";
import { UserBlogsBanInfo } from "../dom/user.entity.blogs.ban.info";
import { errorHandler } from "../../application/error.handler";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    @InjectRepository(UserEmailConfirmation) private readonly userEmailConfirmationRepo:
      Repository<UserEmailConfirmation>,
    @InjectRepository(UserBanInfo) private readonly userBanInfoRepo:
      Repository<UserBanInfo>,
    @InjectRepository(UserBlogsBanInfo) private readonly userBlogBanInfoRepo:
      Repository<UserBlogsBanInfo>,
    @InjectRepository(UserSentEmails) private readonly userSentEmailsRepo:
      Repository<UserSentEmails>
  ) {
  };

  async saveUser(user: Users) {
    try {
      await this.userRepo.save(user);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteUser(id: string) {
    try {
      await this.userRepo.delete({ id });
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveUserEmailConfirmation(userEmailConfirmation: UserEmailConfirmation) {
    try {
      await this.userEmailConfirmationRepo.save(userEmailConfirmation);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveUserBanInfo(userBanInfo: UserBanInfo) {
    try {
      await this.userBanInfoRepo.save(userBanInfo);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveUserSentEmails(userSentEmails: UserSentEmails) {
    try {
      await this.userSentEmailsRepo.save(userSentEmails);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveUserBlogsBanInfo(userBlogsBanInfo: UserBlogsBanInfo) {
    try {
      await this.userBlogBanInfoRepo.save(userBlogsBanInfo);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserBlogBanInfo(userId: string, blogId: string) {
    try {
      const userBlogBanInfo = await this.userBlogBanInfoRepo
        .findOneBy({ userId, blogId });
      return userBlogBanInfo;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserBanInfo(userId: string) {
    try {
      const userBanInfo = await this.userBanInfoRepo
        .findOneBy({ userId });
      return userBanInfo;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserEmailConfirm(confirmationCode: string) {
    try {
      const userEmailConfirm = await this.userEmailConfirmationRepo
        .findOneBy({ confirmationCode });
      return userEmailConfirm;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserEmailConfirmByUser(userId: string) {
    try {
      const userEmailConfirm = await this.userEmailConfirmationRepo
        .findOneBy({ userId });
      return userEmailConfirm;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUser(id: string) {
    try {
      const user = await this.userRepo.findOneBy({ id });
      return user;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deleteAllSQL() {
    try {
      await this.dataSource.query(`TRUNCATE "users", 
      "user_sent_emails", "user_email_confirmation",
      "user_blogs_ban_info", "user_ban_info" CASCADE;`);
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async registrateUserSQL(userDTO: UserDTO) {
  //   const userId = uuidv4();
  //   const confirmationCode = uuidv4();
  //   try {
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(Users)
  //       .values({
  //         id: userId,
  //         login: userDTO.login,
  //         email: userDTO.email,
  //         passwordHash: userDTO.passwordHash,
  //         passwordSalt: userDTO.passwordSalt,
  //         createdAt: new Date().toISOString(),
  //         registrationIP: userDTO.ip
  //       })
  //       .execute();
  //
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(UserEmailConfirmation)
  //       .values({
  //         expirationDate: add(new Date(), { hours: 24 }).toISOString(),
  //         // isConfirmed: false,
  //         confirmationCode,
  //         userId: userId
  //       })
  //       .execute();
  //
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(UserBanInfo)
  //       .values({
  //         // isBanned: false,
  //         // banDate: null,
  //         // banReason: null,
  //         userId: userId
  //       })
  //       .execute();
  //
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(UserSentEmails)
  //       .values({
  //         sentDate: new Date().toISOString(),
  //         confirmId: confirmationCode,
  //         userId: userId
  //       })
  //       .execute();
  //     return { userId, confirmationCode };
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async setBanStatusByBloggerSQL(config: string, userId: string,
  //                                banInfo: BloggerBanUserInputModel) {
  //   try {
  //     if (config === "add") {
  //       await this.dataSource.createQueryBuilder()
  //         .insert()
  //         .into(UserBlogsBanInfo)
  //         .values({
  //           isBanned: banInfo.isBanned,
  //           banReason: banInfo.banReason,
  //           blogId: banInfo.blogId,
  //           banDate: new Date().toISOString(),
  //           userId: userId
  //         })
  //         .execute();
  //       return true;
  //     }
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(UserBlogsBanInfo)
  //       .set({
  //         isBanned: banInfo.isBanned,
  //         banReason: banInfo.banReason,
  //         banDate: new Date().toISOString()
  //       })
  //       .where("userId = :userId AND blogId = :blogId",
  //         { userId, blogId: banInfo.blogId })
  //       .execute();
  //
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  async activateUserSQL(userId) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(UserEmailConfirmation)
        .set({ isConfirmed: true })
        .where("userId = :userId", { userId })
        .execute();
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async updatePasswordSQL(userId: string, passwordHash: string,
  //                         passwordSalt: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(Users)
  //       .set({ passwordHash, passwordSalt })
  //       .where("id = :userId", { userId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  async updateConfirmationInfoSQL(userId: string, confirmationCode: string) {
    try {
      await this.dataSource
        .createQueryBuilder()
        .update(UserEmailConfirmation)
        .set({ confirmationCode: confirmationCode })
        .where("userId = :userId", { userId })
        .execute();

      await this.dataSource.createQueryBuilder()
        .insert()
        .into(UserSentEmails)
        .values({
          sentDate: new Date().toISOString(),
          confirmId: confirmationCode,
          userId: userId
        })
        .execute();
      return true;
    } catch (e) {
      return errorHandler(e);
    }
  };

  // async createUserSQL(userDTO: UserDTO) {
  //   const userId = uuidv4();
  //
  //   try {
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(Users)
  //       .values({
  //         id: userId,
  //         login: userDTO.login,
  //         email: userDTO.email,
  //         passwordHash: userDTO.passwordHash,
  //         passwordSalt: userDTO.passwordSalt,
  //         createdAt: new Date().toISOString(),
  //         registrationIP: userDTO.ip
  //       })
  //       .execute();
  //
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(UserEmailConfirmation)
  //       .values({
  //         expirationDate: "none",
  //         isConfirmed: true,
  //         userId: userId
  //       })
  //       .execute();
  //
  //     await this.dataSource.createQueryBuilder()
  //       .insert()
  //       .into(UserBanInfo)
  //       .values({
  //         // isBanned: false,
  //         // banDate: null,
  //         // banReason: null,
  //         userId: userId
  //       })
  //       .execute();
  //     return userId;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async setBanStatusSQL(isBanned: boolean, banReason: string, userId: string) {
  //   const banDate = isBanned ? new Date().toISOString() : null;
  //   banReason = isBanned ? banReason : null;
  //
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .update(UserBanInfo)
  //       .set({ isBanned, banDate, banReason })
  //       .where("userId = :userId", { userId })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };

  // async deleteUserSQL(id: string) {
  //   try {
  //     await this.dataSource
  //       .createQueryBuilder()
  //       .delete()
  //       .from(Users)
  //       .where("id = :id", { id })
  //       .execute();
  //     return true;
  //   } catch (e) {
  //     return errorHandler(e);
  //   }
  // };
};