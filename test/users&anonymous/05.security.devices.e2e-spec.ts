// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   loginInput1, token, userInput1, URL, userInput2, loginInput2
// } from "../dataForTests";
// import { startApp } from "../../src/application/start.app";
//
// let user_01: any;
// let user_02: any;
// let session: any;
// let token_01 = { ...token };
// let token_02 = { ...token };
// let cookie_01: string[];
// let cookie_02: string[];
//
// describe("SecurityController (e2e)", () => {
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
//   // TEST #00
//   it("Create user_01 by SuperAdmin. Status 201", async () => {
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
//   // TEST #00
//   it("Create user_02 by SuperAdmin. Status 201", async () => {
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
//   // TEST #00
//   it("LOGIN Blogger_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput1);
//
//     const accessToken = response.body;
//
//     cookie_01 = response.get("Set-Cookie");
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_01 = { ...accessToken };
//
//     const sessionResponse = await request(app.getHttpServer())
//       .get(`${URL}/testing/session/${user_01.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//
//     session = sessionResponse.body[0];
//   });
//
//   // TEST #00
//   it("LOGIN Blogger_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput2);
//
//     const accessToken = response.body;
//
//     cookie_02 = response.get("Set-Cookie");
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_02 = { ...accessToken };
//   });
//
//   // TEST #1
//   it("Get User_01 session. Status 401", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/security/devices`)
//       .set("Cookie", "123")
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #2
//   it("Get User_01 session. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/security/devices`)
//       .set("Cookie", cookie_01)
//       .expect(HTTP.OK_200, [
//         {
//           ip: session.ip,
//           title: session.title,
//           lastActiveDate: session.lastActiveDate,
//           deviceId: session.deviceId
//         }
//       ]);
//   });
//
//   // TEST #3
//   it("Delete User_01 session. Status 401", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/security/devices`)
//       .set("Cookie", "123")
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #4
//   it("Delete User_01 session. Status 204", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/security/devices`)
//       .set("Cookie", cookie_01)
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #5
//   it("Get User_01 session. Status 204", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/security/devices`)
//       .set("Cookie", cookie_01)
//       .expect(HTTP.OK_200, [
//         {
//           ip: session.ip,
//           title: session.title,
//           lastActiveDate: session.lastActiveDate,
//           deviceId: session.deviceId
//         }
//       ]);
//   });
//
//   // TEST #6
//   it("Delete User_01 current session. Status 404", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/security/devices/100`)
//       .set("Cookie", cookie_01)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #7
//   it("Delete User_01 current session by User_02. Status 403", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/security/devices/${session.deviceId}`)
//       .set("Cookie", cookie_02)
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #8
//   it("Delete User_01 current session. Status 401", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/security/devices/${session.deviceId}`)
//       .set("Cookie", "123")
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #9
//   it("Delete User_01 current session. Status 204", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/security/devices/${session.deviceId}`)
//       .set("Cookie", cookie_01)
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #10
//   it("Get User_01 session. Status 204", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/security/devices`)
//       .set("Cookie", cookie_01)
//       .expect(HTTP.OK_200, []);
//   });
// });