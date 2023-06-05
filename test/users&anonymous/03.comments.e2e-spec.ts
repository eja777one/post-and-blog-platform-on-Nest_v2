// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   blog, comment, commentInput, commentInputToUpdate, loginInput1,
//   loginInput2, post, token, user, userInput1, userInput2,
//   URL, blogInput1, blogPostInput1, banInfo, unBanInfo
// } from "../dataForTests";
// import { startApp } from "../../src/application/start.app";
//
// let blog_01 = { ...blog };
// let post_01 = { ...post };
// let blogger_01 = { ...user };
// let blogger_02 = { ...user };
// let token_01 = { ...token };
// let token_02 = { ...token };
// let comment_01 = { ...comment };
//
// jest.setTimeout(10000)
//
// describe("CommentsController (e2e)", () => {
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
//   });
//
//   // TEST #00
//   it("Create comment_01 for post_01 by blogger_02. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/posts/${post_01.id}/comments`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(commentInput);
//
//     const comment = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(comment).toStrictEqual({
//         id: expect.any(String),
//         content: commentInput.content,
//         commentatorInfo: {
//           userId: blogger_02.id,
//           userLogin: blogger_02.login
//         },
//         createdAt: expect.any(String),
//         likesInfo: {
//           likesCount: 0,
//           dislikesCount: 0,
//           myStatus: "None"
//         }
//       }
//     );
//
//     comment_01 = { ...comment };
//   });
//
//   // TEST #1
//   it("Get comment_100 by blogger_02. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/comments/100`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #2
//   it("Get comment_01 by blogger_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`);
//
//     const comment = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(comment).toStrictEqual({
//       commentatorInfo: {
//         userId: blogger_02.id,
//         userLogin: blogger_02.login
//       },
//       id: expect.any(String),
//       content: comment_01.content,
//       createdAt: expect.any(String),
//       likesInfo: {
//         dislikesCount: 0,
//         likesCount: 0,
//         myStatus: "None"
//       }
//     });
//   });
//
//   // TEST #3
//   it("Ban blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/users/${blogger_02.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(banInfo)
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #4
//   it("Get comment_01. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/comments/${comment_01.id}`)
//       .expect(HTTP.NOT_FOUND_404)
//   });
//
//   // TEST #3
//   it("Ban blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/sa/users/${blogger_02.id}/ban`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(unBanInfo)
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #5
//   it("Update comment_100 by blogger_02. Status 404", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/100`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(commentInputToUpdate)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #6
//   it("Update comment_01 by blogger_01. Status 403", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(commentInputToUpdate)
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #7
//   it("Update comment_01 by anonymous. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer token_01.accessToken`)
//       .send(commentInputToUpdate)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #8
//   it("Update comment_01 by blogger_02. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({ content: "bad content" })
//       .expect(HTTP.BAD_REQUEST_400);
//   });
//
//   // TEST #9
//   it("Update comment_01 by blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(commentInputToUpdate)
//       .expect(HTTP.NO_CONTENT_204);
//
//     comment_01.content = commentInputToUpdate.content;
//   });
//
//   // TEST #10
//   it("Like comment_100 by Blogger_01. Status 404", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/100/like-status`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({ likeStatus: "Like" })
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #11
//   it("Like comment_01 by anonymous. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}/like-status`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send({ likeStatus: "Like" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #12
//   it("Like comment_01 by Blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({ likeStatus: "I don't like" })
//       .expect(HTTP.BAD_REQUEST_400);
//   });
//
//   // TEST #13
//   it("Like comment_01 by Blogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({ likeStatus: "Like" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #14
//   it("Delete Like for comment_01 by BLogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({ likeStatus: "None" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #15
//   it("Dislike comment_01 by Blogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({ likeStatus: "Dislike" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #16
//   it("Dislike comment_01 by Blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/comments/${comment_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({ likeStatus: "Dislike" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #17
//   it("Get comment_01 by Blogger_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`);
//
//     const comment = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(comment).toStrictEqual({
//       commentatorInfo: {
//         userId: blogger_02.id,
//         userLogin: blogger_02.login
//       },
//       id: expect.any(String),
//       content: commentInputToUpdate.content,
//       createdAt: expect.any(String),
//       likesInfo: {
//         dislikesCount: 2,
//         likesCount: 0,
//         myStatus: "Dislike"
//       }
//     });
//   });
//
//   // TEST #18
//   it("Get comment_01 by anonymous. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/comments/${comment_01.id}`);
//
//     const comment = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(comment).toStrictEqual({
//       commentatorInfo: {
//         userId: blogger_02.id,
//         userLogin: blogger_02.login
//       },
//       id: expect.any(String),
//       content: commentInputToUpdate.content,
//       createdAt: expect.any(String),
//       likesInfo: {
//         dislikesCount: 2,
//         likesCount: 0,
//         myStatus: "None"
//       }
//     });
//   });
//
//   // TEST #19
//   it("Delete comment_100 by Blogger_02. Status 404", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/comments/100`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #20
//   it("Delete comment_01 by Blogger_01. Status 403", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #21
//   it("Delete comment_01 by anonymous. Status 401", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer token_02.accessToken`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #22
//   it("Delete comment_01 by Blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/comments/${comment_01.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #23
//   it("Get comment_01 by anonymous. Status 404", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/comments/${comment_01.id}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
// });