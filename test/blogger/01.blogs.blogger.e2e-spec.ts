// import { startApp } from "../../src/application/start.app";
// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   badBlogInput, badBlogPostInput, blog, blogErrorResult, blogInput1, blogInput2,
//   blogInputToUpdate, blogPostErrorResult, blogPostInput1, blogPostInput1Update,
//   blogPostInput2, loginInput1, loginInput2, post, token, URL, user, userInput1,
//   userInput2
// } from "../dataForTests";
// import { useContainer } from "class-validator";
//
// let blog_01 = { ...blog };
// let blog_02 = { ...blog };
// let post_01 = { ...post };
// let post_02 = { ...post };
// let blogger_01 = { ...user };
// let blogger_02 = { ...user };
// let token_01 = { ...token };
// let token_02 = { ...token };
//
// describe("BloggerBlogsController (e2e)", () => {
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test
//       .createTestingModule({ imports: [AppModule] }).compile();
//
//     app = moduleFixture.createNestApplication();
//     app = startApp(app);
//     useContainer(app, { fallbackOnErrors: true });
//     await app.init();
//   });
//
//   it("Delete all data", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/testing/all-data`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NO_CONTENT_204);
//   });// blogs = []; posts = [];
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
//   // TEST #1
//   it("Get blogs of blogger_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogs = []; posts = [];
//
//   // TEST #2
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
//   // TEST #3
//   it("Get blogs of blogger_02. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   }); // blogs = []; posts = [];
//
//   // TEST #4
//   it("Create blog_01 by blogger_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send(blogInput1)
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogs = []; post = [];
//
//   // TEST #5
//   it("Create blog_01 by blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(badBlogInput)
//       .expect(HTTP.BAD_REQUEST_400, blogErrorResult);
//   }); // blogs = []; post = [];
//
//   // TEST #6
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
//   // TEST #7
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
//   }); // blogs = [blog_01, blog_02]; post = [];
//
//   // TEST #8
//   it("Create post_01 for blog_100 by blogger_01. Status 404", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs/100/posts`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(blogPostInput1)
//       .expect(HTTP.NOT_FOUND_404);
//   }); // blogger = [blog_01, blog_02]; post = [];
//
//   // TEST #9
//   it("Create post_01 for blog_01 by blogger_02. Status 403", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs/${blog_01.id}/posts`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(blogPostInput1)
//       .expect(HTTP.FORBIDDEN_403);
//   }); // blogger = [blog_01, blog_02]; post = [];
//
//   // TEST #10
//   it("Create post_01 for blog_01 by blogger_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs/${blog_01.id}/posts`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send(blogPostInput1)
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01, blog_02]; post = [];
//
//   // TEST #11
//   it("Create post_01 for blog_01 by blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs/${blog_01.id}/posts`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(badBlogPostInput)
//       .expect(HTTP.BAD_REQUEST_400, blogPostErrorResult);
//   }); // blogger = [blog_01, blog_02]; post = [];
//
//   // TEST #12
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
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #13
//   it("Create post_02 for blog_02 by blogger_02. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs/${blog_02.id}/posts`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(blogPostInput2);
//
//     const post = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(post).toStrictEqual({
//       id: expect.any(String),
//       title: blogPostInput2.title,
//       shortDescription: blogPostInput2.shortDescription,
//       content: blogPostInput2.content,
//       blogId: blog_02.id,
//       blogName: blog_02.name,
//       createdAt: expect.any(String),
//       extendedLikesInfo: {
//         likesCount: 0,
//         dislikesCount: 0,
//         myStatus: "None",
//         newestLikes: []
//       }
//     });
//
//     post_02 = { ...post };
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #14
//   it("UPDATE post_100. Status 404", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}/posts/100`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(blogPostInput1Update)
//       .expect(HTTP.NOT_FOUND_404);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #15
//   it("UPDATE post_01 of blog_01 by blogger_02. Status 403", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}/posts/${post_01.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(blogPostInput1Update)
//       .expect(HTTP.FORBIDDEN_403);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #16
//   it("UPDATE post_01 of blog_01 by Anonymous. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}/posts/${post_01.id}`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send(blogPostInput1Update)
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #17
//   it("UPDATE post_01 of blog_01 by Blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}/posts/${post_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(badBlogPostInput)
//       .expect(HTTP.BAD_REQUEST_400, blogPostErrorResult);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #18
//   it("UPDATE post_01 of blog_01 by Blogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}/posts/${post_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(blogPostInput1Update)
//       .expect(HTTP.NO_CONTENT_204);
//
//     post_01.title = blogPostInput1Update.title;
//     post_01.shortDescription = blogPostInput1Update.shortDescription;
//     post_01.content = blogPostInput1Update.content;
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #19
//   it("Delete post_100. Status 404", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/${blog_01.id}/posts/100`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #20
//   it("Delete post_02 of blog_02 by blogger_01. Status 403", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/${blog_02.id}/posts/${post_02.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.FORBIDDEN_403);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #21
//   it("Delete post_02 of blog_02 by anonymous. Status 401", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/${blog_02.id}/posts/${post_02.id}`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #22
//   it("Delete post_02 of blog_02 by blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/${blog_02.id}/posts/${post_02.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #23
//   it("UPDATE blog_01 by blogger_02. Status 403", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(blogInputToUpdate)
//       .expect(HTTP.FORBIDDEN_403);
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #24
//   it("UPDATE blog_01 by blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(badBlogInput)
//       .expect(HTTP.BAD_REQUEST_400, blogErrorResult);
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #25
//   it("UPDATE blog_01 by blogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/blogs/${blog_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(blogInputToUpdate)
//       .expect(HTTP.NO_CONTENT_204);
//
//     blog_01.name = blogInputToUpdate.name;
//     blog_01.description = blogInputToUpdate.description;
//     blog_01.websiteUrl = blogInputToUpdate.websiteUrl;
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #26
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
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #27
//   it("Delete blog_100. Status 404", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/100`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #28
//   it("Delete blog_02. Status 403", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/${blog_02.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.FORBIDDEN_403);
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #29
//   it("Delete blog_02. Status 401", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/${blog_02.id}`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #30
//   it("Delete blog_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/blogger/blogs/${blog_02.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01]; post = [post_01];
//
//   // TEST #31
//   it("Get blogs of blogger_02. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   }); // blogger = [blog_01]; post = [post_01];
// });