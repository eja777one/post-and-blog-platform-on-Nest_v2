import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Request } from "express";
import {
  Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query,
  Req, UploadedFile, UseGuards, UseInterceptors
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }
  from "@nestjs/swagger";
import { ApiImplicitQuery }
  from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { prepareQueries } from "../../application/prepare.query";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { URL, QueryType, HTTP, Paginator } from "../../types";
import {
  BlogInputModel, BlogsImagesViewModel, BlogViewModel, PostImagesViewModel
} from "../blogs.types";
import { CommentWithPostViewModel } from "../../comments/comments.types";
import { PostInputModelNoId, PostViewModel } from "../../posts/posts.types";
import { UpdateBlogCommand } from "../app/use-cases/update.blog.uc";
import { DeleteBlogCommand } from "../app/use-cases/delete.blog.uc";
import { CreateBlogCommand } from "../app/use-cases/create.blog.uc";
import { GetBloggerBlogsQuery } from "../app/queries/get.blogger.blogs.query";
import { GetBloggerBlogCommentsQuery }
  from "../app/queries/get.blogger.comments";
import { CreateBlogsPostCommand }
  from "../../posts/app/use-cases/create.blogs.post.uc";
import { UpdateBlogsPostCommand }
  from "../../posts/app/use-cases/update.blogs.post.uc";
import { DeleteBlogsPostCommand }
  from "../../posts/app/use-cases/delete.blogs.post.uc";
import { UploadBlogWallpaperCommand }
  from "../app/use-cases/upload.blog.wallpaper.uc";
import { UploadBlogMainImageCommand }
  from "../app/use-cases/upload.blog.main.image.uc";
import { UploadPostMainImageCommand }
  from "../app/use-cases/upload.post.main.image.uc";
import {
  sw_createBlog, sw_createBlogsPosts, sw_deleteBlog, sw_deleteBlogsPosts,
  sw_getBlogs, sw_updateBlog, sw_uploadMainImage, sw_uploadWallpaper,
  sw_updateBlogsPosts, sw_uploadPostMainImage, sw_getBloggerBlogComments
} from "./blogs.blogger.swagger.info";

@ApiTags("Blogger Blogs")
@SkipThrottle()
@Controller(URL + "/blogger/blogs")
export class BloggerBlogsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {
  };

  @UseGuards(JwtAuthGuard)
  @Post(":blogId/images/wallpaper")
  @UseInterceptors(FileInterceptor("file"))
  @ApiBearerAuth()
  @ApiOperation(sw_uploadWallpaper.summary)
  @ApiResponse(sw_uploadWallpaper.status201)
  @ApiResponse(sw_uploadWallpaper.status400)
  @ApiResponse(sw_uploadWallpaper.status401)
  @ApiResponse(sw_uploadWallpaper.status403)
  async uploadWallpaper(@UploadedFile() file: Express.Multer.File,
                        @Param("blogId") blogId: string,
                        @Req() req: Request)
    : Promise<BlogsImagesViewModel> {
    const imageInfo = await this.commandBus.execute(
      new UploadBlogWallpaperCommand(blogId, req.user.id, file));
    return imageInfo;
  };

  @UseGuards(JwtAuthGuard)
  @Post(":blogId/images/main")
  @UseInterceptors(FileInterceptor("file"))
  @ApiBearerAuth()
  @ApiOperation(sw_uploadMainImage.summary)
  @ApiResponse(sw_uploadMainImage.status201)
  @ApiResponse(sw_uploadMainImage.status400)
  @ApiResponse(sw_uploadMainImage.status401)
  @ApiResponse(sw_uploadMainImage.status403)
  async uploadMainImage(@UploadedFile() file: Express.Multer.File,
                        @Param("blogId") blogId: string,
                        @Req() req: Request)
    : Promise<BlogsImagesViewModel> {
    const imageInfo = await this.commandBus.execute(
      new UploadBlogMainImageCommand(blogId, req.user.id, file));
    return imageInfo;
  };

  @UseGuards(JwtAuthGuard)
  @Post(":blogId/posts/:postId/images/main")
  @UseInterceptors(FileInterceptor("file"))
  @ApiBearerAuth()
  @ApiOperation(sw_uploadPostMainImage.summary)
  @ApiResponse(sw_uploadPostMainImage.status201)
  @ApiResponse(sw_uploadPostMainImage.status400)
  @ApiResponse(sw_uploadPostMainImage.status401)
  @ApiResponse(sw_uploadPostMainImage.status403)
  async uploadPostMainImage(@UploadedFile() file: Express.Multer.File,
                            @Param("blogId") blogId: string,
                            @Param("postId") postId: string,
                            @Req() req: Request)
    : Promise<PostImagesViewModel> {
    const imageInfo = await this.commandBus.execute(
      new UploadPostMainImageCommand(blogId, postId, req.user.id, file));
    return imageInfo;
  };


  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation(sw_createBlog.summary)
  @ApiResponse(sw_createBlog.status201)
  @ApiResponse(sw_createBlog.status400)
  @ApiResponse(sw_createBlog.status401)
  async createBlog(@Body() blogInput: BlogInputModel, @Req() req: Request)
    : Promise<BlogViewModel> {
    const newBlog = await this.commandBus.execute(
      new CreateBlogCommand(blogInput, req.user));
    return newBlog;
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id")
  @ApiBearerAuth()
  @ApiOperation(sw_updateBlog.summary)
  @ApiResponse(sw_updateBlog.status204)
  @ApiResponse(sw_updateBlog.status400)
  @ApiResponse(sw_updateBlog.status401)
  @ApiResponse(sw_updateBlog.status403)
  async updateBlog(@Param("id") id: string, @Req() req: Request,
                   @Body() blogInput: BlogInputModel) {
    await this.commandBus.execute(
      new UpdateBlogCommand(id, blogInput, req.user.id));
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation(sw_deleteBlog.summary)
  @ApiResponse(sw_deleteBlog.status204)
  @ApiResponse(sw_deleteBlog.status401)
  @ApiResponse(sw_deleteBlog.status403)
  @ApiResponse(sw_deleteBlog.status404)
  async deleteBlog(@Param("id") id: string, @Req() req: Request) {
    await this.commandBus.execute(new DeleteBlogCommand(id, req.user.id));
  };

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiImplicitQuery(sw_getBlogs.searchNameTerm)
  @ApiImplicitQuery(sw_getBlogs.sortBy)
  @ApiImplicitQuery(sw_getBlogs.sortDirection)
  @ApiImplicitQuery(sw_getBlogs.pageNumber)
  @ApiImplicitQuery(sw_getBlogs.pageSize)
  @ApiOperation(sw_getBlogs.summary)
  @ApiResponse(sw_getBlogs.status200)
  @ApiResponse(sw_getBlogs.status401)
  async getBlogs(@Req() req: Request, @Query() query: QueryType):
    Promise<Paginator<BlogViewModel>> {
    const queryForSearch = prepareQueries(query);
    const blogs = await this.queryBus.execute(
      new GetBloggerBlogsQuery(queryForSearch, req.user.id));
    return blogs;
  };

  @UseGuards(JwtAuthGuard)
  @Post(":id/posts")
  @ApiBearerAuth()
  @ApiOperation(sw_createBlogsPosts.summary)
  @ApiResponse(sw_createBlogsPosts.status201)
  @ApiResponse(sw_createBlogsPosts.status400)
  @ApiResponse(sw_createBlogsPosts.status401)
  @ApiResponse(sw_createBlogsPosts.status403)
  @ApiResponse(sw_createBlogsPosts.status404)
  async createBlogsPosts(@Param("id") id: string, @Req() req: Request,
                         @Body() postInput: PostInputModelNoId)
    : Promise<PostViewModel> {
    return this.commandBus.execute(
      new CreateBlogsPostCommand(id, postInput, req.user));
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Put(":id/posts/:postId")
  @ApiBearerAuth()
  @ApiOperation(sw_updateBlogsPosts.summary)
  @ApiResponse(sw_updateBlogsPosts.status204)
  @ApiResponse(sw_updateBlogsPosts.status400)
  @ApiResponse(sw_updateBlogsPosts.status401)
  @ApiResponse(sw_updateBlogsPosts.status403)
  @ApiResponse(sw_updateBlogsPosts.status404)
  async updateBlogsPosts(@Param("id") id: string, @Req() req: Request,
                         @Param("postId") postId: string,
                         @Body() postInput: PostInputModelNoId) {
    return this.commandBus.execute(
      new UpdateBlogsPostCommand(id, postId, postInput, req.user));
  };

  @UseGuards(JwtAuthGuard)
  @HttpCode(HTTP.NO_CONTENT_204)
  @Delete(":id/posts/:postId")
  @ApiBearerAuth()
  @ApiOperation(sw_deleteBlogsPosts.summary)
  @ApiResponse(sw_deleteBlogsPosts.status204)
  @ApiResponse(sw_deleteBlogsPosts.status401)
  @ApiResponse(sw_deleteBlogsPosts.status403)
  @ApiResponse(sw_deleteBlogsPosts.status404)
  async deleteBlogsPosts(@Param("id") id: string, @Req() req: Request,
                         @Param("postId") postId: string) {
    return this.commandBus.execute(
      new DeleteBlogsPostCommand(id, postId, req.user));
  };

  @UseGuards(JwtAuthGuard)
  @Get("comments")
  @ApiBearerAuth()
  @ApiImplicitQuery(sw_getBloggerBlogComments.sortBy)
  @ApiImplicitQuery(sw_getBloggerBlogComments.sortDirection)
  @ApiImplicitQuery(sw_getBloggerBlogComments.pageNumber)
  @ApiImplicitQuery(sw_getBloggerBlogComments.pageSize)
  @ApiOperation(sw_getBloggerBlogComments.summary)
  @ApiResponse(sw_getBloggerBlogComments.status200)
  @ApiResponse(sw_getBloggerBlogComments.status401)
  async getBloggerBlogComments(@Req() req: Request, @Query() query: QueryType)
    : Promise<Paginator<CommentWithPostViewModel>> {
    const queryForSearch = prepareQueries(query);
    const comments = await this.queryBus.execute(
      new GetBloggerBlogCommentsQuery(queryForSearch, req.user.id));
    return comments;
  };
};