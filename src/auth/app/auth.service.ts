import { hash } from "bcrypt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor() {
  };

  async _generateHash(password: string, salt: string) {
    const newHash = await hash(password, salt);
    return newHash;
  };
};