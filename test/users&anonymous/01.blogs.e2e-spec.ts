// import { startApp } from "../../src/application/start.app";
// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   blog, blogInput1, blogInput2, blogPostInput1, loginInput1, loginInput2,
//   post, token, URL, user, userInput1, userInput2
// } from "../dataForTests";
//
// let blog_01 = { ...blog };
// let blog_02 = { ...blog };
// let post_01 = { ...post };
// let blogger_01 = { ...user };
// let blogger_02 = { ...user };
// let token_01 = { ...token };
// let token_02 = { ...token };
//
// jest.setTimeout(10000)
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
//   }); // blogs = [];
//
//   // TEST #00
//   it("Create blogger_02 by SuperAdmin. Status 201", async () => {
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
//     blogger_02 = { ...user };
//   }); // blogs = [];
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
//   it("LOGIN Blogger_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput2);
//
//     const accessToken = response.body;
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
//   // TEST #00
//   it("CREATE blog_01 by blogger_01. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
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
//
//     blog_01 = { ...blog };
//   }); // blogs = [blog_01]; post = [];
//
//   // TEST #00
//   it("CREATE blog_02 by blogger_02. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(blogInput2);
//
//     const blog = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(blog).toStrictEqual({
//       id: expect.any(String),
//       name: blogInput2.name,
//       description: blogInput2.description,
//       websiteUrl: blogInput2.websiteUrl,
//       createdAt: expect.any(String),
//       isMembership: false
//     });
//
//     blog_02 = { ...blog };
//   }); // blogs = [blog_01, blog_02];
//
//   // TEST #00
//   it("Create post_01 for blog_01 by blogger_01. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs/${blog_01.id}/posts`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(blogPostInput1);
//
//     const post = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(post).toStrictEqual({
//       id: expect.any(String),
//       title: blogPostInput1.title,
//       shortDescription: blogPostInput1.shortDescription,
//       content: blogPostInput1.content,
//       blogId: blog_01.id,
//       blogName: blog_01.name,
//       createdAt: expect.any(String),
//       extendedLikesInfo: {
//         likesCount: 0,
//         dislikesCount: 0,
//         myStatus: "None",
//         newestLikes: []
//       }
//     });
//
//     post_01 = { ...post };
//   }); // blogger = [blog_01, blog_02];
//
//   // TEST #1
//   it("Get blogs by user or anonymous. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogs`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 2,
//         items: [
//           {
//             id: blog_02.id,
//             name: blog_02.name,
//             description: blog_02.description,
//             websiteUrl: blog_02.websiteUrl,
//             createdAt: blog_02.createdAt,
//             isMembership: false
//           },
//           {
//             id: blog_01.id,
//             name: blog_01.name,
//             description: blog_01.description,
//             websiteUrl: blog_01.websiteUrl,
//             createdAt: blog_01.createdAt,
//             isMembership: false
//           }
//         ]
//       });
//   }); // blogger = [blog_01, blog_02];
//
//   // TEST #2
//   it("Get posts of blog 100 by user or anonymous. Status 404", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogs/100/posts`)
//       .expect(HTTP.NOT_FOUND_404);
//   }); // blogger = [blog_01, blog_02];
//
//   // TEST #3
//   it("Get posts of blog_01 by user or anonymous. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogs/${blog_01.id}/posts`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 1,
//         items: [
//           {
//             id: post_01.id,
//             title: post_01.title,
//             shortDescription: post_01.shortDescription,
//             content: post_01.content,
//             blogId: post_01.blogId,
//             blogName: post_01.blogName,
//             createdAt: post_01.createdAt,
//             extendedLikesInfo: {
//               likesCount: 0,
//               dislikesCount: 0,
//               myStatus: "None",
//               newestLikes: []
//             }
//           }
//         ]
//       });
//   }); // blogger = [blog_01, blog_02];
//
//   // TEST #4
//   it("Get blog_100 by user or anonymous. Status 404", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogs/100`)
//       .expect(HTTP.NOT_FOUND_404);
//   }); // blogger = [blog_01, blog_02];
//
//   // TEST #5
//   it("Get blog_01 by user or anonymous. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogs/${blog_01.id}`)
//       .expect(HTTP.OK_200, {
//         id: blog_01.id,
//         name: blog_01.name,
//         description: blog_01.description,
//         websiteUrl: blog_01.websiteUrl,
//         createdAt: blog_01.createdAt,
//         isMembership: false
//       });
//   }); // blogger = [blog_01, blog_02];
//
//   // TEST #6
//   it("Get blog_02 by user or anonymous. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogs/${blog_02.id}`)
//       .expect(HTTP.OK_200, {
//         id: blog_02.id,
//         name: blog_02.name,
//         description: blog_02.description,
//         websiteUrl: blog_02.websiteUrl,
//         createdAt: blog_02.createdAt,
//         isMembership: false
//       });
//   }); // blogger = [blog_01, blog_02];
// });