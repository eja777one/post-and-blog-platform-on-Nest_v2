import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UsersRequest, UsersRequestModelType } from "../dom/users.request.schema";
import { UsersRequestDBModel } from "../users.types";

@Injectable()
export class UsersRequestRepository {

  constructor(
    @InjectModel(UsersRequest.name) private UsersRequestModel: UsersRequestModelType
  ) { };

  async addLog(userLog: UsersRequestDBModel) {
    const usersLogs = await this.UsersRequestModel
      .create({
        // _id: userLog._id,
        ip: userLog.ip,
        url: userLog.url,
        createdAt: userLog.createdAt
      })
    return usersLogs;
  }

  async getLogs(userLog: UsersRequestDBModel, attemmptTime: Date) {
    const isoDate = attemmptTime.toISOString();

    const result = await this.UsersRequestModel.countDocuments({
      ip: { $regex: userLog.ip },
      url: { $regex: userLog.url },
      createdAt: { $gt: isoDate }
    });

    return result;
  }

  async deleteAll() {
    const result = await this.UsersRequestModel.deleteMany({});
    return result.deletedCount;
  }
};