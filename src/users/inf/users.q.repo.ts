import { Paginator, QueryType } from "src/types";
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Users } from "../dom/users.entity";
import { UserBlogsBanInfo } from "../dom/user.entity.blogs.ban.info";
import { errorHandler } from "../../application/error.handler";
import { BloggerUserViewModel, SAUserViewModel } from "../users.types";

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {
  };

  async getBlogsBannedUsersSQL(queryForSearch: QueryType, id: string)
    : Promise<Paginator<BloggerUserViewModel>> {

    const term = queryForSearch.searchLoginTerm ?
      `%${queryForSearch.searchLoginTerm}%` : `%%`;

    const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

    try {
      const query = this.dataSource
        .getRepository(UserBlogsBanInfo)
        .createQueryBuilder("ubbi")
        .innerJoinAndSelect("ubbi.user", "u")
        .where("ubbi.blogId = :blogId AND LOWER(u.login) LIKE LOWER(:term) " +
          "AND ubbi.isBanned = true", { blogId: id, term });

      const users = await query
        .orderBy(`u.${queryForSearch.sortBy} COLLATE "C"`,
          queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      const usersCount = await query.getCount();

      return {
        pagesCount: Math.ceil(usersCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: usersCount,
        items: users.map(rawUser => formatBanUser(rawUser))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUsersBySASQL(queryForSearch: QueryType)
    : Promise<Paginator<SAUserViewModel>> {
    let banStatus = "%";

    if (queryForSearch.banStatus === "banned") banStatus = "true";
    else if (queryForSearch.banStatus === "notBanned") banStatus = "false";

    const loginTerm = queryForSearch.searchLoginTerm ?
      `%${queryForSearch.searchLoginTerm}%` : `%%`;

    const emailTerm = queryForSearch.searchEmailTerm ?
      `%${queryForSearch.searchEmailTerm}%` : `%%`;

    const skip = ((queryForSearch.pageNumber - 1) * queryForSearch.pageSize);

    try {
      const query = this.dataSource
        .getRepository(Users)
        .createQueryBuilder("u")
        .innerJoinAndSelect("u.userBanInfo", "ubi")
        .where(
          "(CASE WHEN ubi.isBanned = true THEN 'true' ELSE 'false' END)" +
          " LIKE (:banStatus) AND" +
          "(LOWER(u.login) LIKE LOWER(:loginTerm) " +
          "OR LOWER(u.email) LIKE LOWER(:emailTerm))",
          { banStatus, loginTerm, emailTerm });

      const usersCount = await query.getCount();

      const users = await query
        .orderBy(`u.${queryForSearch.sortBy} COLLATE "C"`, queryForSearch.sortDirection)
        .limit(queryForSearch.pageSize)
        .offset(skip)
        .getMany();

      return {
        pagesCount: Math.ceil(usersCount / queryForSearch.pageSize),
        page: queryForSearch.pageNumber,
        pageSize: queryForSearch.pageSize,
        totalCount: usersCount,
        items: users.map(rawUser => formatUserForSa(rawUser))
      };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getViewUserSQL(param: string):Promise<SAUserViewModel> {
    try {
      const user = await this.dataSource
        .getRepository(Users)
        .createQueryBuilder("users")
        .innerJoinAndSelect("users.userBanInfo", "ubi")
        .where("users.id::text = :param OR users.login = :param " +
          "OR users.email = :param", { param })
        .getOne();
      return user ? formatUserForSa(user) : null;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserBlogBanInfoSQL(userId: string, blogId: string) {
    try {
      const info = await this.dataSource
        .getRepository(UserBlogsBanInfo)
        .createQueryBuilder("ubbi")
        .where("ubbi.userId = :userId AND ubbi.blogId = :blogId",
          { userId, blogId })
        .getOne();
      return info;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserByEmailSQL(email: string) {
    try {
      const rawUser = await this.dataSource
        .getRepository(Users)
        .createQueryBuilder("users")
        .leftJoinAndSelect("users.userSentEmails", "1")
        .innerJoinAndSelect("users.userEmailConfirmation", "2")
        .innerJoinAndSelect("users.userBanInfo", "3")
        .leftJoinAndSelect("users.userBlogsBanInfo", "4")
        .where("users.email = :email", { email })
        .getOne();
      return rawUser;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserByConfirmSQL(code: string) {
    try {
      const user = await this.dataSource
        .getRepository(Users)
        .createQueryBuilder("users")
        .innerJoinAndSelect("users.userEmailConfirmation", "uec")
        .where("uec.confirmationCode = :code", { code })
        .getOne();
      return user;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async checkUserSQL(email: string, login: string) {
    try {
      const isUserExist = await this.dataSource
        .getRepository(Users)
        .createQueryBuilder("users")
        .where("users.email = :email OR users.login = :login", { email, login })
        .getMany();

      const errors = [];

      if (isUserExist.find(el => el.email === email))
        errors.push({ message: "Incorrect email", field: "email" });
      if (isUserExist.find(el => el.login === login))
        errors.push({ message: "Incorrect login", field: "login" });

      return errors;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async getUserSQL(param: string) {
    try {
      const user = await this.dataSource
        .getRepository(Users)
        .createQueryBuilder("users")
        .innerJoinAndSelect("users.userEmailConfirmation", "uec")
        .innerJoinAndSelect("users.userBanInfo", "ubi")
        .leftJoinAndSelect("users.userBlogsBanInfo", "ubbi")
        .where("users.id::text = :param OR users.login = :param " +
          "OR users.email = :param", { param })
        .getOne();
      return user;
    } catch (e) {
      return errorHandler(e);
    }
  };
};

const formatUserForSa = (user: any): SAUserViewModel => {
  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
    banInfo: {
      isBanned: user.userBanInfo.isBanned,
      banDate: user.userBanInfo.banDate,
      banReason: user.userBanInfo.banReason
    }
  };
};

const formatBanUser = (rawUser: any): BloggerUserViewModel => {
  return {
    id: rawUser.user.id,
    login: rawUser.user.login,
    banInfo: {
      isBanned: rawUser.isBanned,
      banDate: rawUser.banDate,
      banReason: rawUser.banReason
    }
  };
};