// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   badUserInput1, userErrorResult, userInput1, userInput2, URL, banInfo,
//   badBanInfo, banInfoErrorResult, unBanInfo, loginInput2, user2
// } from "./../dataForTests";
// import { startApp } from "../../src/application/start.app";
//
// let user_01 = { ...user2 };
// let user_02 = { ...user2 };
//
// jest.setTimeout(10000);
//
// describe("UsersController (e2e)", () => {
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule =
//       await Test.createTestingModule({ imports: [AppModule] }).compile();
//
//     app = moduleFixture.createNestApplication();
//     app = startApp(app);
//     await app.init();
//   });
//
//   it("Delete all data", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/testing/all-data`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #1
//   it("GET Users. Status 401", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/users`)
//       .auth("admin", "admin", { type: "basic" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #2
//   it("GET Users. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   });
//
//   // TEST #3
//   it("Create User_01 (unauthorized). Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "admin", { type: "basic" })
//       .send(userInput1)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #4
//   it("Create User_01 (bad request). Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(badUserInput1)
//       .expect(HTTP.BAD_REQUEST_400, userErrorResult);
//   });
//
//   // TEST #5
//   it("Create User_01. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(userInput1);
//
//     const user = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput1.login,
//       email: userInput1.email,
//       createdAt: expect.any(String),
//       banInfo: {
//         banDate: null,
//         banReason: null,
//         isBanned: false
//       }
//     });
//
//     user_01 = { ...user };
//   });
//
//   // TEST #6
//   it("Create User_02. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(userInput2);
//
//     const user = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput2.login,
//       email: userInput2.email,
//       createdAt: expect.any(String),
//       banInfo: {
//         banDate: null,
//         banReason: null,
//         isBanned: false
//       }
//     });
//
//     user_02 = { ...user };
//   });
//
//   // TEST #7
//   it("GET Users. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.OK_200, {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 2,
//         items: [user_02, user_01]
//       });
//   });
//
//   // TEST #8
//   it("Ban User_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/users/${user_01.id}/ban`)
//       .auth("admin", "admin", { type: "basic" })
//       .send(banInfo)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #9
//   it("Ban User_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/users/${user_01.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(badBanInfo)
//       .expect(HTTP.BAD_REQUEST_400, banInfoErrorResult);
//   });
//
//   // TEST #10
//   it("Ban User_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/users/${user_01.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(banInfo)
//       .expect(HTTP.NO_CONTENT_204);
//
//     user_01.banInfo.banReason = banInfo.banReason;
//     user_01.banInfo.isBanned = banInfo.isBanned;
//   });
//
//   // TEST #11
//   it("Ban User_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/users/${user_02.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(banInfo)
//       .expect(HTTP.NO_CONTENT_204);
//
//     user_02.banInfo.banReason = banInfo.banReason;
//     user_02.banInfo.isBanned = banInfo.isBanned;
//   });
//
//   // TEST #12
//   it("Login User_02. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput2)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #13
//   it("Unban User_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/users/${user_02.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(unBanInfo)
//       .expect(HTTP.NO_CONTENT_204);
//
//     user_02.banInfo.banDate = null;
//     user_02.banInfo.banReason = null;
//     user_02.banInfo.isBanned = unBanInfo.isBanned;
//   });
//
//   // TEST #14
//   it("Login User_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput2)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #15
//   it("GET Users. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" });
//
//     const users = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(users).toStrictEqual({
//       pagesCount: 1,
//       page: 1,
//       pageSize: 10,
//       totalCount: 2,
//       items: [
//         {
//           id: user_02.id,
//           login: user_02.login,
//           email: user_02.email,
//           createdAt: user_02.createdAt,
//           banInfo: {
//             banDate: user_02.banInfo.banDate,
//             banReason: user_02.banInfo.banReason,
//             isBanned: user_02.banInfo.isBanned
//           }
//         },
//         {
//           id: user_01.id,
//           login: user_01.login,
//           email: user_01.email,
//           createdAt: user_01.createdAt,
//           banInfo: {
//             banDate: expect.any(String),
//             banReason: user_01.banInfo.banReason,
//             isBanned: user_01.banInfo.isBanned
//           }
//         }
//       ]
//     });
//   });
//
//   // TEST #16
//   it("DELETE User10. Status 404", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/sa/users/10`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #17
//   it("DELETE User_02. Status 401", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/sa/users/${user_02.id}`)
//       .auth("admin", "admin", { type: "basic" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #18
//   it("DELETE User_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/sa/users/${user_02.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #19
//   it("GET Users. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" });
//
//     const users = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(users).toStrictEqual({
//       pagesCount: 1,
//       page: 1,
//       pageSize: 10,
//       totalCount: 1,
//       items: [
//         {
//           id: user_01.id,
//           login: user_01.login,
//           email: user_01.email,
//           createdAt: user_01.createdAt,
//           banInfo: {
//             banDate: expect.any(String),
//             banReason: user_01.banInfo.banReason,
//             isBanned: user_01.banInfo.isBanned
//           }
//         }
//       ]
//     });
//   });
// });