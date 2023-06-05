import { UserViewModel, UserInputModel, LoginInputModel, SAUserViewModel } from "../src/users/users.types";
import { BlogInputModel, BlogViewModel } from "../src/blogs/blogs.types";
import { CommentViewModel, CommentInputModel } from "../src/comments/comments.types";
import { PostViewModel } from "../src/posts/posts.types";

export const URL = "/hometask_29/api";

// for Blogs

export let blog: BlogViewModel;
export let post: PostViewModel;

export const blogInput1: BlogInputModel = {
  name: "blog_1",
  description: "blog_description_1",
  websiteUrl: "https://www.google.com/"
};

export const blogInput2: BlogInputModel = {
  name: "blog_name_2",
  description: "blog_description_2",
  websiteUrl: "https://www.google.com/"
};

export const badBlogInput = {
  name: "string",
  description: "string",
  websiteUrl: "google"
};

export const blogErrorResult = {
  errorsMessages: [
    {
      message: `Incorrect websiteUrl`,
      field: "websiteUrl"
    }
  ]
};

export const blogInputToUpdate = {
  name: "new",
  description: "new",
  websiteUrl: "https://www.google.com/"
};

export const blogPostInput1 = {
  title: "title_of_blogs_post_1",
  shortDescription: "shDesc_of_blogs_post_1",
  content: "content_of_blogs_post_1"
};
export const blogPostInput1Update = {
  title: "update_title_of_blogs_post_1",
  shortDescription: "update_shDesc_of_blogs_post_1",
  content: "update_content_of_blogs_post_1"
};
export const blogPostInput2 = {
  title: "title_of_blogs_post_2",
  shortDescription: "shDesc_of_blogs_post_2",
  content: "content_of_blogs_post_2"
};

export const badBlogPostInput = {
  title: "string",
  shortDescription: "string"
};

export const blogPostErrorResult = {
  errorsMessages: [
    {
      message: `Incorrect content`,
      field: "content"
    }
  ]
};

// for comments

export let user: UserViewModel;
export let token: { accessToken: string };
export let comment: CommentViewModel;

export let user2: SAUserViewModel;

export const userInput1: UserInputModel = {
  login: "user1",
  password: "user1pass",
  email: "eja777one@gmail.com"
};

export const badUserInput1 = {
  login: "user1",
  password: "user1pass",
  email: "eja777one.com"
};

export const badRegEmailResending = {
  email: "eja777one.com"
};

export const userErrorResult = {
  errorsMessages: [
    {
      message: `Incorrect email`,
      field: "email"
    }
  ]
};

export const codeErrorResult = {
  errorsMessages: [
    {
      message: `incorrect code`,
      field: "code"
    }
  ]
};

export const userInput2: UserInputModel = {
  login: "user2",
  password: "user2pass",
  email: "pgs111213@yandex.ru"
};

export const userInput3: UserInputModel = {
  login: "user3",
  password: "user3pass",
  email: "blogplatforminfo@gmail.com"
};

export const loginInput1: LoginInputModel = {
  loginOrEmail: userInput1.login,
  password: userInput1.password
};

export const badLoginBody = {
  loginOrEmail: 424,
  password: userInput1.password
};

export const badLoginBody2 = {
  loginOrEmail: "LOGIN",
  password: userInput1.password
};

export const loginInput2: LoginInputModel = {
  loginOrEmail: userInput2.login,
  password: userInput2.password
};

export const loginInput3: LoginInputModel = {
  loginOrEmail: userInput3.login,
  password: userInput3.password
};

export const commentInput: CommentInputModel = {
  content: "stringstringstringst"
};

export const badCommentInput: any = {
  content: "1"
};

export const badCommentErrorResult = {
  errorsMessages: [
    {
      message: `Incorrect content`,
      field: "content"
    }
  ]
};

export const commentInputToUpdate: CommentInputModel = {
  content: "updateupdateupdateup"
};

// for posts

export const postInput1 = {
  title: "string",
  shortDescription: "string",
  content: "string",
  blogId: "string"
};

export const postInput1ToUpdate = {
  title: "string",
  shortDescription: "string",
  content: "string",
  blogId: "string"
};

export const badPostInput = {
  title: "string",
  shortDescription: "string",
  content: "string",
  blogId: "string"
};

export const postErrorResult = {
  errorsMessages: [
    {
      message: `Incorrect blogId`,
      field: "blogId"
    }
  ]
};

export const banInfo = {
  isBanned: true,
  banReason: "agressive to other users"
};

export const unBanInfo = {
  isBanned: false,
  banReason: "unbanunbanunbanunbanunban"
};

export const badBanInfo = {
  isBanned: 2,
  banReason: "agressive to other users"
};

export const banInfoErrorResult = {
  errorsMessages: [
    {
      message: `Incorrect isBanned`,
      field: "isBanned"
    }
  ]
};

export const badBlogBanInfo = {
  isBanned: true,
  banReason: "agressive to other users"
};

export const banBlogInfoErrorResult = {
  errorsMessages: [
    {
      message: `Incorrect blogId`,
      field: "blogId"
    }
  ]
};