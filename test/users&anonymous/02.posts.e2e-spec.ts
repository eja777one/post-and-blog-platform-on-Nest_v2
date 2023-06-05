// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import { startApp } from "../../src/application/start.app";
// import { useContainer } from "class-validator";
// import {
//   blog, comment, commentInput, loginInput1, post, user, userInput1,
//   URL, userInput2, loginInput2, token, blogInput1, blogInput2, blogPostInput1,
//   blogPostInput2, badCommentInput, badCommentErrorResult
// } from "../dataForTests";
//
// let blog_01 = { ...blog };
// let blog_02 = { ...blog };
// let post_01 = { ...post };
// let post_02 = { ...post };
// let blogger_01 = { ...user };
// let blogger_02 = { ...user };
// let token_01 = { ...token };
// let token_02 = { ...token };
// let comment_01 = { ...comment };
//
// describe("PostsController (e2e)", () => {
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule =
//       await Test.createTestingModule({ imports: [AppModule] }).compile();
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
//   }); // blogger = [blog_01, blog_02]; post = [post_01];
//
//   // TEST #00
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
//   // TEST #1
//   it("Get posts by anonymous. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/posts`);
//
//     const posts = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(posts).toStrictEqual({
//       pagesCount: 1,
//       page: 1,
//       pageSize: 10,
//       totalCount: 2,
//       items: [post_02, post_01]
//     });
//
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #2
//   it("Change like status of post_100 by blogger_01. Status 404", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/posts/100/like-status`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({ likeStatus: "Like" })
//       .expect(HTTP.NOT_FOUND_404);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #3
//   it("Change like status of post_01 by user_100. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/posts/${post_01.id}/like-status`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send({ likeStatus: "Like" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #4
//   it("Change like status of post_01 by blogger_02. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/posts/${post_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({ likeStatus: "Well" })
//       .expect(HTTP.BAD_REQUEST_400, {
//         errorsMessages: [{
//           message: "Incorrect likeStatus",
//           field: "likeStatus"
//         }]
//       });
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #5
//   it("Change like status of post_01 by blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/posts/${post_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({ likeStatus: "Like" })
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #6
//   it("Change like status of post_02 by blogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/posts/${post_02.id}/like-status`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({ likeStatus: "Dislike" })
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #7
//   it("Get posts by anonymous. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/posts`);
//
//     const posts = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(posts).toStrictEqual({
//       pagesCount: 1,
//       page: 1,
//       pageSize: 10,
//       totalCount: 2,
//       items: [
//         {
//           id: post_02.id,
//           title: post_02.title,
//           shortDescription: post_02.shortDescription,
//           content: post_02.content,
//           blogId: post_02.blogId,
//           blogName: post_02.blogName,
//           createdAt: post_02.createdAt,
//           extendedLikesInfo: {
//             likesCount: 0,
//             dislikesCount: 1,
//             myStatus: "None",
//             newestLikes: []
//           }
//         },
//         {
//           id: post_01.id,
//           title: post_01.title,
//           shortDescription: post_01.shortDescription,
//           content: post_01.content,
//           blogId: post_01.blogId,
//           blogName: post_01.blogName,
//           createdAt: post_01.createdAt,
//           extendedLikesInfo: {
//             likesCount: 1,
//             dislikesCount: 0,
//             myStatus: "None",
//             newestLikes: [
//               {
//                 addedAt: expect.any(String),
//                 login: blogger_02.login,
//                 userId: blogger_02.id
//               }
//             ]
//           }
//         }
//       ]
//     });
//
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #8
//   it("Change like status of post_01 by blogger_02. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/posts/${post_01.id}/like-status`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({ likeStatus: "Dislike" })
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #9
//   it("Change like status of post_02 by blogger_01. Status 204", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/posts/${post_02.id}/like-status`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({ likeStatus: "Like" })
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #10
//   it("Get posts by blogger_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/posts`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`);
//
//     const posts = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(posts).toStrictEqual({
//       pagesCount: 1,
//       page: 1,
//       pageSize: 10,
//       totalCount: 2,
//       items: [
//         {
//           id: post_02.id,
//           title: post_02.title,
//           shortDescription: post_02.shortDescription,
//           content: post_02.content,
//           blogId: post_02.blogId,
//           blogName: post_02.blogName,
//           createdAt: post_02.createdAt,
//           extendedLikesInfo: {
//             likesCount: 1,
//             dislikesCount: 0,
//             myStatus: "Like",
//             newestLikes: [
//               {
//                 addedAt: expect.any(String),
//                 login: blogger_01.login,
//                 userId: blogger_01.id
//               }
//             ]
//           }
//         },
//         {
//           id: post_01.id,
//           title: post_01.title,
//           shortDescription: post_01.shortDescription,
//           content: post_01.content,
//           blogId: post_01.blogId,
//           blogName: post_01.blogName,
//           createdAt: post_01.createdAt,
//           extendedLikesInfo: {
//             likesCount: 0,
//             dislikesCount: 1,
//             myStatus: "None",
//             newestLikes: []
//           }
//         }
//       ]
//     });
//
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #11
//   it("Get post_100 by blogger_01. Status 404", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/posts/100`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #12
//   it("Get post_01 by blogger_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/posts/${post_01.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`);
//
//     const post = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(post).toStrictEqual({
//         id: post_01.id,
//         title: post_01.title,
//         shortDescription: post_01.shortDescription,
//         content: post_01.content,
//         blogId: post_01.blogId,
//         blogName: post_01.blogName,
//         createdAt: post_01.createdAt,
//         extendedLikesInfo: {
//           likesCount: 0,
//           dislikesCount: 1,
//           myStatus: "Dislike",
//           newestLikes: []
//         }
//       }
//     );
//   });
//
//   // TEST #13
//   it("Create comment for post_100 by blogger_01. Status 404", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/posts/100`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(commentInput)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #14
//   it("Create comment for post_02 by anonymous. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/posts/${post_02.id}/comments`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send(commentInput)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #15
//   it("Create comment for post_02 by blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/posts/${post_02.id}/comments`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(badCommentInput)
//       .expect(HTTP.BAD_REQUEST_400, badCommentErrorResult);
//   });
//
//   // TEST #16
//   it("Create comment for post_02 by blogger_01. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/posts/${post_02.id}/comments`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
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
//           userId: blogger_01.id,
//           userLogin: blogger_01.login
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
//   // TEST #17
//   it("GET comments of post 100 by anonymous. Status 404", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/posts/100/comments`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #18
//   it("GET comments of post 100 by anonymous. Status 404", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/posts/100/comments`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #19
//   it("GET comments of post_01. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/posts/${post_02.id}/comments`)
//       .expect(HTTP.OK_200, {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 1,
//         items: [comment_01]
//       });
//   });
// });