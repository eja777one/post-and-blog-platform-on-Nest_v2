// import { startApp } from "../../src/application/start.app";
// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   blog, blogInput1, loginInput1, token, URL, user, userInput1
// } from "../dataForTests";
// import { ObjectId } from "mongodb";
//
// let blog_01 = { ...blog };
// let blogger_01 = { ...user };
// let token_01 = { ...token };
//
// describe("BlogsController (e2e)", () => {
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
//   // TEST #00
//   it("Create blogger_01 by SuperAdmin. Status 201", async () => {
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
//     blogger_01 = { ...user };
//   }); // blogs = []; posts = [];
//
//   // TEST #00
//   it("LOGIN Blogger_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput1);
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
//   // TEST #00
//   it("Create blog_01 without user. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/blogs`)
//       .send(blogInput1);
//
//     const blog = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(blog).toStrictEqual({
//       id: expect.any(String),
//       name: blogInput1.name,
//       description: blogInput1.description,
//       websiteUrl: blogInput1.websiteUrl,
//       createdAt: expect.any(String),
//       isMembership: false
//     });
//     blog_01 = { ...blog };
//   }); // blogs = [blog_01];
//
//   // TEST #1
//   it("Get blogs of blogger_01. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   }); // blogs = []; posts = [];
//
//   // TEST #2
//   it("Bind blog_01 with blogger_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/blogs/${blog_01.id}/bind-with-user/${blogger_01.id}`)
//       // .auth("admin", "admin", { type: "basic" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogs = [blog_01];
//
//   // TEST #3
//   it("Bind blog_01 with blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/blogs/${new ObjectId()}/bind-with-user/${blogger_01.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.BAD_REQUEST_400);
//   }); // blogs = [blog_01];
//
//   // TEST #4
//   it("Bind blog_01 with blogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/blogs/${blog_01.id}/bind-with-user/${blogger_01.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogs = [blog_01];
//
//   // TEST #5
//   it("Get blogs of blogger_01. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 1,
//         items: [{
//           id: blog_01.id,
//           name: blog_01.name,
//           description: blog_01.description,
//           websiteUrl: blog_01.websiteUrl,
//           createdAt: blog_01.createdAt,
//           isMembership: false
//         }]
//       });
//   }); // blogger = [blog_01];
//
//   // TEST #6
//   it("Get blogs by SuperAdmin. Status 401", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/blogs`)
//       .auth("admin", "admin", { type: "basic" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01];
//
//   // TEST #7
//   it("Get blogs by SuperAdmin. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/sa/blogs`)
//       .auth("admin", "qwerty", { type: "basic" });
//
//     const blogs = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(blogs).toStrictEqual(
//       {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 1,
//         items: [{
//           id: blog_01.id,
//           name: blog_01.name,
//           description: blog_01.description,
//           websiteUrl: blog_01.websiteUrl,
//           createdAt: blog_01.createdAt,
//           isMembership: false,
//           blogOwnerInfo: {
//             userId: blogger_01.id,
//             userLogin: blogger_01.login
//           },
//           banInfo: {
//             isBanned: false,
//             banDate: null
//           }
//         }]
//       }
//     );
//   }); // blogger = [blog_01];
//
//   // TEST #8
//   it("Ban blog_01 by SuperAdmin. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/blogs/${blog_01.id}/ban`)
//       .auth("admin", "admin", { type: "basic" })
//       .send({ isBanned: true })
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01];
//
//   // TEST #9
//   it("Ban blog_01 by SuperAdmin. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/blogs/${blog_01.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send({ isBanned: 33 })
//       .expect(HTTP.BAD_REQUEST_400, {
//         errorsMessages: [{
//           message: "Incorrect isBanned",
//           field: "isBanned"
//         }]
//       });
//   }); // blogger = [blog_01];
//
//   // TEST #10
//   it("Ban blog_01 by SuperAdmin. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/blogs/${blog_01.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send({ isBanned: true })
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01];
//
//   // TEST #11
//   it("Get blogs by SuperAdmin. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/sa/blogs`)
//       .auth("admin", "qwerty", { type: "basic" });
//
//     const blogs = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(blogs).toStrictEqual(
//       {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 1,
//         items: [{
//           id: blog_01.id,
//           name: blog_01.name,
//           description: blog_01.description,
//           websiteUrl: blog_01.websiteUrl,
//           createdAt: blog_01.createdAt,
//           isMembership: false,
//           blogOwnerInfo: {
//             userId: blogger_01.id,
//             userLogin: blogger_01.login
//           },
//           banInfo: {
//             isBanned: true,
//             banDate: expect.any(String)
//           }
//         }]
//       }
//     );
//   }); // blogger = [blog_01];
//
//   // TEST #12
//   it("Get blogs by anonymous. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogs`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   }); // blogs = [];
// });