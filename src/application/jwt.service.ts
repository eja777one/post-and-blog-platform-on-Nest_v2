import { ObjectId } from 'mongodb';
import { sign, verify } from 'jsonwebtoken';
import { settings } from './settings';
import { ConfigService } from "@nestjs/config";

const config = new ConfigService();

export const jwtService = {

  async createAccessJwt(userId: string) {
    // console.log(config.get("ACCESS_TOKEN_SECRET_EXPIRES_IN"));

    return sign({ userId }, config.get("ACCESS_TOKEN_SECRET"),
      { expiresIn: config.get("ACCESS_TOKEN_SECRET_EXPIRES_IN") });
  },

  async createRefreshJwt(userId: string, deviceId: string, createdAt: string) {
    return sign(
      { userId, deviceId, createdAt },
      settings.REFRESH_JWT_SECRET,
      { expiresIn: config.get("REFRESH_TOKEN_SECRET_EXPIRES_IN") }
    );
  },

  async getUserIdByToken(token: string) {
    try {
      // console.log(token);
      const result: any = verify(token, config.get("ACCESS_TOKEN_SECRET"));
      return result.userId
      // return new ObjectId(result.userId);
    } catch (error) {
      // console.log(error);
      return null };
  },

  async getPayloadRefToken(token: string) {
    try {
      const result: any = verify(token, settings.REFRESH_JWT_SECRET);
      return {
        userId: result.userId,
        deviceId: result.deviceId,
        createdAt: result.createdAt
      };
    } catch (error) { return null };
  },

  async getExpiredPayloadRefToken(token: string) {
    try {
      const result: any = verify(token, settings.REFRESH_JWT_SECRET,
        { ignoreExpiration: true });

      return {
        userId: result.userId,
        deviceId: result.deviceId,
        createdAt: result.createdAt
      };
    } catch (error) { return null };
  },
};