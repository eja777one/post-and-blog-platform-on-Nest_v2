// import { startApp } from "../../src/application/start.app";
// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import {
//   badBlogBanInfo, banBlogInfoErrorResult, blog, blogInput1, blogInput2,
//   blogPostInput1, blogPostInput2, comment, commentInput, loginInput1,
//   loginInput2, loginInput3, post, token, URL, user, userInput1, userInput2,
//   userInput3
// } from "../dataForTests";
// import { useContainer } from "class-validator";
//
// let blogger_01 = { ...user };
// let user_01 = { ...user };
// let user_02 = { ...user };
// let token_01 = { ...token };
// let token_02 = { ...token };
// let token_03 = { ...token };
// let blog_01 = { ...blog };
// let blog_02 = { ...blog };
// let post_01 = { ...post };
// let post_02 = { ...post };
// let comment_01 = { ...comment };
// let comment_02 = { ...comment };
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
//   });
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
//   });
//
//   // TEST #00
//   it("Create user_01 by SuperAdmin. Status 201", async () => {
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
//     user_01 = { ...user };
//   });
//
//   // TEST #00
//   it("Create user_02 by SuperAdmin. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(userInput3);
//
//     const user = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput3.login,
//       email: userInput3.email,
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
//   it("LOGIN User_01. Status 200", async () => {
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
//   it("LOGIN User_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput3);
//
//     const accessToken = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_03 = { ...accessToken };
//   });
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
//   });
//
//   // TEST #2
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
//   });
//
//   // TEST #3
//   it("CREATE blog_02 by blogger_01. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
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
//   });
//
//   // TEST #4
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
//   // TEST #5
//   it("Create post_02 for blog_02 by blogger_01. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/blogger/blogs/${blog_02.id}/posts`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
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
//   // TEST #6
//   it("Ban User_01 by Blogger_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/users/${user_01.id}/ban`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send({
//         isBanned: true,
//         banReason: "agressive to other",
//         blogId: blog_01.id
//       })
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #7
//   it("Ban User_01 by Blogger_01. Status 400", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/users/${user_01.id}/ban`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send(badBlogBanInfo)
//       .expect(HTTP.BAD_REQUEST_400, banBlogInfoErrorResult);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #8
//   it("Ban User_01 by Blogger_01. Status 201", async () => {
//     await request(app.getHttpServer())
//       .put(`${URL}/blogger/users/${user_01.id}/ban`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({
//         isBanned: true,
//         banReason: "agressive to other agressive",
//         blogId: blog_01.id
//       })
//       .expect(HTTP.NO_CONTENT_204);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #9
//   it("Create comment for post_01 by user_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .post(`${URL}/posts/${post_01.id}/comments`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send(commentInput)
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #10
//   it("Get banned users for blog_01 by blogger_01. Status 401", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/blogger/users/blog/${blog_01.id}`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #11
//   it("Get banned users for blog_01 by blogger_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/blogger/users/blog/${blog_01.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`);
//
//     const users = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(users).toStrictEqual(
//       {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 1,
//         items: [
//           {
//             id: user_01.id,
//             login: user_01.login,
//             banInfo: {
//               isBanned: true,
//               banDate: expect.any(String),
//               banReason: expect.any(String)
//             }
//           }
//         ]
//       }
//     );
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #12
//   it("Create comment for post_01 by user_02. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/posts/${post_01.id}/comments`)
//       .set("Authorization", `Bearer ${token_03.accessToken}`)
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
//           userId: user_02.id,
//           userLogin: user_02.login
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
//   // TEST #13
//   it("Create comment for post_02 by user_02. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/posts/${post_02.id}/comments`)
//       .set("Authorization", `Bearer ${token_03.accessToken}`)
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
//           userId: user_02.id,
//           userLogin: user_02.login
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
//     comment_02 = { ...comment };
//   });
//
//   // TEST #14
//   it("Get all comments for all blogger blogs posts. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/blogger/blogs/comments`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
//
//   // TEST #15
//   it("Get all comments for all blogger blogs posts. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/blogger/blogs/comments`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`);
//
//     const users = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(users).toStrictEqual(
//       {
//         pagesCount: 1,
//         page: 1,
//         pageSize: 10,
//         totalCount: 2,
//         items: [
//           {
//             id: comment_02.id,
//             content: comment_02.content,
//             commentatorInfo: {
//               userId: comment_02.commentatorInfo.userId,
//               userLogin: comment_02.commentatorInfo.userLogin
//             },
//             createdAt: expect.any(String),
//             likesInfo: {
//               dislikesCount: 0,
//               likesCount: 0,
//               myStatus: "None"
//             },
//             postInfo: {
//               id: post_02.id,
//               title: post_02.title,
//               blogId: blog_02.id,
//               blogName: blog_02.name
//             }
//           },
//           {
//             id: comment_01.id,
//             content: comment_01.content,
//             commentatorInfo: {
//               userId: comment_01.commentatorInfo.userId,
//               userLogin: comment_01.commentatorInfo.userLogin
//             },
//             createdAt: expect.any(String),
//             likesInfo: {
//               dislikesCount: 0,
//               likesCount: 0,
//               myStatus: "None"
//             },
//             postInfo: {
//               id: post_01.id,
//               title: post_01.title,
//               blogId: blog_01.id,
//               blogName: blog_01.name
//             }
//           }
//         ]
//       }
//     );
//   }); // blogger = [blog_01, blog_02]; post = [post_01, post_02];
// });