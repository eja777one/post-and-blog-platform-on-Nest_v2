import { startApp } from "../../src/application/start.app";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { HTTP } from "../../src/types";
import {
  badBlogInput, badBlogPostInput, blog, blogErrorResult, blogInput1, blogInput2, blogInput3, blogInput4,
  blogInputToUpdate, blogPostErrorResult, blogPostInput1, blogPostInput1Update,
  blogPostInput2, loginInput1, loginInput2, post, token, URL, user, userInput1,
  userInput2
} from "../dataForTests";
import { useContainer } from "class-validator";

let blog_01 = { ...blog };
let blog_02 = { ...blog };
let blog_03 = { ...blog };
let blog_04 = { ...blog };
let post_01 = { ...post };
let post_02 = { ...post };

const blogInput = [
  { name: "b_n_1", description: "b_d_1", websiteUrl: "https://www.google.com/" },
  { name: "b_n_2", description: "b_d_2", websiteUrl: "https://www.google.com/" },
  { name: "b_n_3", description: "b_d_3", websiteUrl: "https://www.google.com/" },
  { name: "b_n_4", description: "b_d_4", websiteUrl: "https://www.google.com/" },
  { name: "b_n_5", description: "b_d_5", websiteUrl: "https://www.google.com/" },
  { name: "b_n_6", description: "b_d_6", websiteUrl: "https://www.google.com/" }
];

const blogs: any = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "" };

const userInput = [
  { login: "user1", password: "user1pass", email: "user1@gmail.com" },
  { login: "user2", password: "user2pass", email: "user2@gmail.com" },
  { login: "user3", password: "user3pass", email: "user3@gmail.com" }
];

const loginInput = [
  { loginOrEmail: "user1@gmail.com", password: "user1pass" },
  { loginOrEmail: "user2@gmail.com", password: "user2pass" },
  { loginOrEmail: "user3@gmail.com", password: "user3pass" }
];

let users = [];
let tokens = [];

jest.setTimeout(15000)

describe("Telegram flow (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test
      .createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    app = startApp(app);
    useContainer(app, { fallbackOnErrors: true });
    await app.init();
  });

  // TEST #1
  it("Delete all data", async () => {
    await request(app.getHttpServer())
      .delete(`${URL}/testing/all-data`)
      .auth("admin", "qwerty", { type: "basic" })
      .expect(HTTP.NO_CONTENT_204);
  });// blogs = []; posts = [];

  // TEST #2
  it("Create 3 users by SuperAdmin. Status 201", async () => {
    for (let u of userInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/sa/users`)
        .auth("admin", "qwerty", { type: "basic" })
        .send(u);

      const user = response.body;
      users.push(user);
    }

    expect(true).toBe(true);
  });

  // TEST #2
  it("Login 3 users. Status 200", async () => {
    for (let l of loginInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/auth/login`)
        .send(l);

      const accessToken = response.body;
      tokens.push(accessToken);
    }

    expect(true).toBe(true);
  });

  // TEST #3
  it("CREATE blog_01 by user_01. Status 201", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogger/blogs`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`)
      .send(blogInput[0]);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      id: expect.any(String),
      name: blogInput[0].name,
      description: blogInput[0].description,
      websiteUrl: blogInput[0].websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
      images: {
        wallpaper: null,
        main: []
      }
    });

    blogs[1] = blog;
  });

  // TEST #3
  it("User_02 try to subscribed to blog_100. Status 404", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/100/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NOT_FOUND_404);
  });

  // TEST #3
  it("Anonymous try to subscribed to blog_01. Status 404", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[1].id}/subscription`)
      .set("Authorization", `Bearer {tokens[1].accessToken}`)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #3
  it("User_02 try to subscribed to blog_01. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[1].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #3
  it("User_03 try to subscribed to blog_01. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[1].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #3
  it("Get blog_01 by user_02. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs/${blogs[1].id}`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      ...blogs[1],
      currentUserSubscriptionStatus: "Subscribed",
      subscribersCount: 2
    });
  });

  // TEST #3
  it("Get blog_01 by user_01. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs/${blogs[1].id}`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      ...blogs[1],
      currentUserSubscriptionStatus: "None",
      subscribersCount: 2
    });
  });

  // TEST #4
  it("CREATE blog_02 by user_01. Status 201", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogger/blogs`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`)
      .send(blogInput[1]);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      id: expect.any(String),
      name: blogInput[1].name,
      description: blogInput[1].description,
      websiteUrl: blogInput[1].websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
      images: {
        wallpaper: null,
        main: []
      }
    });

    blogs[2] = blog;
  });

  // TEST #4
  it("User_02 try to subscribed to blog_02. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[2].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #4
  it("User_02 try to unsubscribed from blog_100. Status 404", async () => {
    const response = await request(app.getHttpServer())
      .delete(`${URL}/blogs/100/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NOT_FOUND_404);
  });

  // TEST #4
  it("Anonymous try to unsubscribed from blog_02. Status 401", async () => {
    const response = await request(app.getHttpServer())
      .delete(`${URL}/blogs/${blogs[2].id}/subscription`)
      .set("Authorization", `Bearer {tokens[1].accessToken}`)
      .expect(HTTP.UNAUTHORIZED_401);
  });

  // TEST #4
  it("User_02 try to unsubscribed from blog_02. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .delete(`${URL}/blogs/${blogs[2].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #4
  it("Get blog_02 by user_02. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs/${blogs[2].id}`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      ...blogs[2],
      currentUserSubscriptionStatus: "Unsubscribed",
      subscribersCount: 0
    });
  });

  // TEST #4
  it("Get blog_02 by user_03. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs/${blogs[2].id}`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      ...blogs[2],
      currentUserSubscriptionStatus: "None",
      subscribersCount: 0
    });
  });

  // TEST #4
  it("Get blog_02 by anonymous. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs/${blogs[2].id}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      ...blogs[2],
      currentUserSubscriptionStatus: "None",
      subscribersCount: 0
    });
  });

  // TEST #5
  it("CREATE blog_03 by user_01. Status 201", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogger/blogs`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`)
      .send(blogInput[2]);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      id: expect.any(String),
      name: blogInput[2].name,
      description: blogInput[2].description,
      websiteUrl: blogInput[2].websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
      images: {
        wallpaper: null,
        main: []
      }
    });

    blogs[3] = blog;
  });

  // TEST #5
  it("User_02 try to subscribed to blog_03. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[3].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #5
  it("User_02 try to subscribed to blog_03. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[3].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #5
  it("Get blog_03 by user_02. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs/${blogs[3].id}`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      ...blogs[3],
      currentUserSubscriptionStatus: "Subscribed",
      subscribersCount: 1
    });
  });

  // TEST #6
  it("CREATE blog_04 by user_01. Status 201", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogger/blogs`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`)
      .send(blogInput[3]);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.CREATED_201);
    expect(blog).toStrictEqual({
      id: expect.any(String),
      name: blogInput[3].name,
      description: blogInput[3].description,
      websiteUrl: blogInput[3].websiteUrl,
      createdAt: expect.any(String),
      isMembership: false,
      images: {
        wallpaper: null,
        main: []
      }
    });

    blogs[4] = blog;
  });

  // TEST #6
  it("User_02 try to subscribed to blog_04. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[4].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6
  it("User_03 try to subscribed to blog_04. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[4].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6
  it("User_03 try to unsubscribed from blog_04. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .delete(`${URL}/blogs/${blogs[4].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6
  it("User_03 try to unsubscribed from blog_04. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .delete(`${URL}/blogs/${blogs[4].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #6
  it("Get blog_04 by user_02. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs/${blogs[4].id}`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    const blog = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(blog).toStrictEqual({
      ...blogs[4],
      currentUserSubscriptionStatus: "Unsubscribed",
      subscribersCount: 1
    });
  });

  // TEST #7
  it("Delete all data", async () => {
    await request(app.getHttpServer())
      .delete(`${URL}/testing/all-data`)
      .auth("admin", "qwerty", { type: "basic" })
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #8
  it("Create 3 users by SuperAdmin. Status 201", async () => {
    users = [];
    for (let u of userInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/sa/users`)
        .auth("admin", "qwerty", { type: "basic" })
        .send(u);

      const user = response.body;
      users.push(user);
    }

    expect(true).toBe(true);
  });

  // TEST #8
  it("Login 3 users. Status 200", async () => {
    tokens = [];
    for (let l of loginInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/auth/login`)
        .send(l);

      const accessToken = response.body;
      tokens.push(accessToken);
    }

    expect(true).toBe(true);
  });

  // TEST #9
  it("User_01 create 6 blogs. Status 201", async () => {
    let i = 1;
    for (let input of blogInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/blogger/blogs`)
        .set("Authorization", `Bearer ${tokens[0].accessToken}`)
        .send(input);

      const blog = response.body;
      blogs[i] = blog;
      i++;
    }

    expect(true).toBe(true);
  });

  // TEST #9
  it("User_02 try to subscribed to blog_01. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[1].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #9
  it("User_02 try to subscribed to blog_03. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[3].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #9
  it("User_02 try to subscribed to blog_05. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[5].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #9
  it("User_03 try to subscribed to blog_01. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[1].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #9
  it("User_03 try to subscribed to blog_03. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[3].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #9
  it("User_03 try to subscribed to blog_06. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .post(`${URL}/blogs/${blogs[6].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #9
  it("User_02 try to unsubscribed from blog_03. Status 204", async () => {
    const response = await request(app.getHttpServer())
      .delete(`${URL}/blogs/${blogs[3].id}/subscription`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #9
  it("Get blogs by user_02. Status 200", async () => {
    const response = await request(app.getHttpServer())
      .get(`${URL}/blogs`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    const getBlogs = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(getBlogs).toStrictEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 6,
        items: [
          {
            ...blogs[6],
            currentUserSubscriptionStatus: "None",
            subscribersCount: 1
          },
          {
            ...blogs[5],
            currentUserSubscriptionStatus: "Subscribed",
            subscribersCount: 1
          },
          {
            ...blogs[4],
            currentUserSubscriptionStatus: "None",
            subscribersCount: 0
          },
          {
            ...blogs[3],
            currentUserSubscriptionStatus: "Unsubscribed",
            subscribersCount: 1
          },
          {
            ...blogs[2],
            currentUserSubscriptionStatus: "None",
            subscribersCount: 0
          },
          {
            ...blogs[1],
            currentUserSubscriptionStatus: "Subscribed",
            subscribersCount: 2
          }
        ]
      }
    );
  });

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
});