import { BadRequestException, ForbiddenException, NotFoundException }
  from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { makeErorrMessage } from "../../../application/make.error.message";
import { S3StorageAdapter } from "../../../files.storage.adapter";
import { BlogImage } from "../../dom/blog.entity.images";

export class UploadBlogMainImageCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public file: Express.Multer.File
  ) {
  };
};

@CommandHandler(UploadBlogMainImageCommand)
export class UploadBlogMainImageUseCase
  implements ICommandHandler<UploadBlogMainImageCommand> {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository,
    private fileStorageAdapter: S3StorageAdapter
  ) {
  };

  async execute(command: UploadBlogMainImageCommand) {
    const metadata = await this.validateImage(command.file);

    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.blogId);

    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.userId)
      throw new ForbiddenException();

    const mainImageInfo = await this.blogsRepository
      .getImageInfo(blog.id, "main");
    // console.log(wallpaperInfo);

    if (!mainImageInfo) {
      const mainImage = await this.fileStorageAdapter.saveBlogMainImage(
        blog.id, command.file);
      if (!mainImage) throw new NotFoundException();

      const blogImage = new BlogImage();
      blogImage.type = "main";
      blogImage.url = mainImage.url;
      blogImage.eTag = mainImage.fileId;
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

    const metadata = await sharp(image.buffer).metadata();
    const errors = [];

    if (metadata.size > 1024 * 100) errors.push("size");
    if (metadata.width !== 156) errors.push("width");
    if (metadata.height !== 156) errors.push("height");
    if (errors.length !== 0) {
      const formatErr = errors.map(err =>
        ({ message: makeErorrMessage(err).message, field: err }));

      throw new BadRequestException(formatErr);
    }
    return metadata;
  };
};