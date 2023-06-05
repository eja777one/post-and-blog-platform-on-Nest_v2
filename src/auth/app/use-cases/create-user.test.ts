import { AuthService } from "../auth.service";
import { UsersQueryRepository } from "../../../users/inf/users.q.repo";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

describe("integration tests for Auth use cases", () => {
  const authService = new AuthService();
  // const usersQueryRepository = new UsersQueryRepository();

  let mongoMemoryServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    await mongoose.connect(mongoUri);
  });

  class Man {
    sayHi() {
      console.log("hello");
      return 1;
    }
  }

  const someMock: jest.Mocked<Man> = {
    sayHi: jest.fn()
  };

  describe("create user", () => {
    it("should return", async () => {
      expect(5).toBe(5);
    });

  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoMemoryServer.stop();
  });
});