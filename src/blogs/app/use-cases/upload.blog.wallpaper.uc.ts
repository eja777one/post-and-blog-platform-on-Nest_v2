import { BadRequestException, ForbiddenException, NotFoundException }
  from "@nestjs/common";
import sharp from "sharp";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from "uuid";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { makeErorrMessage } from "../../../application/make.error.message";
import { S3StorageAdapter } from "../../../files.storage.adapter";
import { BlogImage } from "../../dom/blog.entity.images";

export class UploadBlogWallpaperCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public file: Express.Multer.File
  ) {
  };
};

@CommandHandler(UploadBlogWallpaperCommand)
export class UploadBlogWallpaperUseCase
  implements ICommandHandler<UploadBlogWallpaperCommand> {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository,
    private fileStorageAdapter: S3StorageAdapter
  ) {
  };

  async execute(command: UploadBlogWallpaperCommand) {
    const metadata = await this.validateImage(command.file);

    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.blogId);

    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.userId)
      throw new ForbiddenException();

    const wallpaperInfo = await this.blogsRepository
      .getImageInfo(blog.id, "wallpaper");
    // console.log(wallpaperInfo);

    if (!wallpaperInfo) {
      const wallpaper = await this.fileStorageAdapter.saveBlogWallpaper(
        blog.id, command.file);
      if (!wallpaper) throw new NotFoundException();

      const blogImage = new BlogImage();
      blogImage.type = "wallpaper";
      blogImage.url = wallpaper.url;
      blogImage.eTag = wallpaper.fileId;
      blogImage.width = metadata.width;
      blogImage.height = metadata.height;
      blogImage.fileSize = command.file.size;
      blogImage.addedAt = new Date().toISOString();
      blogImage.blogId = blog.id;

      const saveImage = await this.blogsRepository.saveBlogImage(blogImage);
      if (!saveImage) throw new NotFoundException();
    }

    const imageInfo = await this.blogsQueryRepository.getImageInfo(blog.id);
    if (!imageInfo) throw new NotFoundException();
    return imageInfo;
  };

  async validateImage(image: any) {
    if (!image) throw new NotFoundException();

    const formats = ["image/jpeg", "image/jpg", "image/png"];

    if (!formats.includes(image.mimetype)) throw new BadRequestException(
      [{ message: makeErorrMessage("mimetype").message, field: "mimetype" }]);

    const errors = [];
    const metadata = await sharp(image.buffer).metadata();

    if (metadata.size > 1024 * 100) errors.push("size");
    if (metadata.width !== 1028) errors.push("width");
    if (metadata.height !== 312) errors.push("height");

    if (errors.length !== 0) {
      const formatErr = errors.map(err =>
        ({ message: makeErorrMessage(err).message, field: err }));
      throw new BadRequestException(formatErr);
    }

    return metadata;
  };
};