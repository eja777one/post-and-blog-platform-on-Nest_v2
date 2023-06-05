// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   badLoginBody, badLoginBody2, badRegEmailResending, badUserInput1, loginInput1,
//   token, userErrorResult, userInput1, URL
// } from "../dataForTests";
// import { startApp } from "../../src/application/start.app";
//
// let user_01: any;
// let token_01 = { ...token };
// let cookie: string[];
//
// jest.setTimeout(10000);
//
// describe("AuthController (e2e)", () => {
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
//   });// blogs = [];
//
//   // // TEST #1
//   // it("Registration User_01. Status 429", async () => {
//   //   let response = await request(app.getHttpServer())
//   //     .post(`${URL}/auth/registration`)
//   //     .send(userInput1);
//   //
//   //   for (let i = 0; i < 10; i++) {
//   //     response = await request(app.getHttpServer())
//   //       .post(`${URL}/auth/registration`)
//   //       .send(userInput1);
//   //   }
//   //
//   //   expect(response.status).toBe(HTTP.TOO_MANY_REQUESTS_429);
//   // });
//
//   // TEST #2
//   it("Registration User_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/registration`)
//       .send(badUserInput1)
//       .expect(HTTP.BAD_REQUEST_400, userErrorResult);
//   });
//
//   // TEST #3
//   it("Registration User_01. Status 204", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/registration`)
//       .send(userInput1);
//
//     const res = await request(app.getHttpServer())
//       .get(`${URL}/testing/user/${userInput1.email}`)
//       .auth("admin", "qwerty", { type: "basic" });
//
//
//     const user = res.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.NO_CONTENT_204);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput1.login,
//       email: userInput1.email,
//       createdAt: expect.any(String),
//       confirmationCode: expect.any(String),
//       expirationDate: expect.any(String),
//       isConfirmed: false,
//       sentEmailsCount: expect.any(Number)
//     });
//
//     user_01 = { ...user };
//   });
//
//   // // TEST #4
//   // it("Create another email confirm to User_01. Status 429", async () => {
//   //   let response = await request(app.getHttpServer())
//   //     .post(`${URL}/auth/registration-email-resending`)
//   //     .send({ email: userInput1.email });
//   //
//   //   for (let i = 0; i < 5; i++) {
//   //     response = await request(app.getHttpServer())
//   //       .post(`${URL}/auth/registration-email-resending`)
//   //       .send({ email: userInput1.email });
//   //   }
//   //
//   //   expect(response.status).toBe(HTTP.TOO_MANY_REQUESTS_429);
//   // });
//
//   // TEST #5
//   it("Create another email confirm to User_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/registration-email-resending`)
//       .send(badRegEmailResending)
//       .expect(HTTP.BAD_REQUEST_400, userErrorResult);
//   });
//
//   // TEST #6
//   it("Create another email confirm to User_01. Status 204", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/registration-email-resending`)
//       .send({ email: userInput1.email });
//
//     const res = await request(app.getHttpServer())
//       .get(`${URL}/testing/user/${userInput1.email}`)
//       .auth("admin", "qwerty", { type: "basic" })
//
//     const user = res.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.NO_CONTENT_204);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput1.login,
//       email: userInput1.email,
//       createdAt: expect.any(String),
//       confirmationCode: expect.any(String),
//       expirationDate: expect.any(String),
//       isConfirmed: false,
//       sentEmailsCount: expect.any(Number)
//     });
//
//     user_01 = { ...user };
//   });
//
//   // TEST #7
//   it("LOGIN User_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput1)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // // // TEST #8
//   // // it('Create activation to User_01. Status 429', async () => { });
//   //
//   // TEST #9
//   it("Create activation to User_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/registration-confirmation`)
//       .send({ code: "Bad confirmation code" })
//       .expect(HTTP.BAD_REQUEST_400);
//   });
//
//   // TEST #10
//   it("Create activation to User_01. Status 204", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/registration-confirmation`)
//       .send({ code: user_01.confirmationCode });
//
//     const res = await request(app.getHttpServer())
//       .get(`${URL}/testing/user/${userInput1.email}`)
//       .auth("admin", "qwerty", { type: "basic" })
//
//     const user = res.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.NO_CONTENT_204);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput1.login,
//       email: userInput1.email,
//       createdAt: expect.any(String),
//       confirmationCode: expect.any(String),
//       expirationDate: expect.any(String),
//       isConfirmed: true,
//       sentEmailsCount: 2
//     });
//
//     user_01 = { ...user };
//   });
//   //
//   // // // TEST #11
//   // // it('LOGIN User_01. Status 429', async () => { });
//
//   // TEST #12
//   it("LOGIN User_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(badLoginBody2)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #13
//   it("LOGIN User_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(badLoginBody)
//       .expect(HTTP.BAD_REQUEST_400);
//   });
//
//   // TEST #14
//   it("LOGIN User_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput1);
//
//     const accessToken = response.body;
//
//     cookie = response.get("Set-Cookie");
//
//     // console.log(cookie)
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_01 = { ...accessToken };
//   });
//
//   // TEST #15
//   it("Refresh token to User_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/refresh-token`)
//       .set("Cookie", "123")
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #16
//   it("Refresh token to User_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/refresh-token`)
//       .set("Cookie", cookie);
//
//     cookie = response.get("Set-Cookie");
//
//     const accessToken = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_01 = { ...accessToken };
//   });
//
//   // TEST #17
//   it("Get info about User_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/auth/me`)
//       .set("Authorization", `Bearer token_01.accessToken`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #18
//   it("Get info about User_01. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/auth/me`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200, {
//         email: user_01.email,
//         login: user_01.login,
//         userId: user_01.id
//       });
//   });
//
//   // TEST #19
//   it("Logout User_01. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/logout`)
//       .set("Cookie", "123")
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #20
//   it("Logout User_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/logout`)
//       .set("Cookie", cookie)
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #21
//   it("Refresh token to User_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/refresh-token`)
//       .set("Cookie", cookie)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #22
//   it("Send recovery password code to User_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/password-recovery`)
//       .send({ email: "string" })
//       .expect(HTTP.BAD_REQUEST_400);
//   });
//
//   // TEST #23
//   it("Send recovery password code to User_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/password-recovery`)
//       .send({ email: "eja777one@gmail.com" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #24
//   it("Send recPass code to email, which is unexist. Status 204", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/password-recovery`)
//       .send({ email: "pgs111213@yandex.ru" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #25
//   it("Reset password to User_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/new-password`)
//       .send({
//         newPassword: "string123",
//         recoveryCode: "string"
//       })
//       .expect(HTTP.BAD_REQUEST_400);
//   });
//
//   // TEST #26
//   it("Reset password to User_01. Status 204", async () => {
//
//     const res = await request(app.getHttpServer())
//       .get(`${URL}/testing/code/${user_01.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//
//     const code = res.body;
//
//     await request(app.getHttpServer())
//       .post(`${URL}/auth/new-password`)
//       .send({
//         newPassword: "string123",
//         recoveryCode: code?.passwordRecoveryCode
//       })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #27
//   it("LOGIN User_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send({
//         loginOrEmail: "eja777one@gmail.com",
//         password: "string123"
//       });
//
//     const accessToken = response.body;
//
//     cookie = response.get("Set-Cookie");
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_01 = { ...accessToken };
//   });
// });