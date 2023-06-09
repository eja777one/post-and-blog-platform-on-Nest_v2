import { BadRequestException, ForbiddenException, NotFoundException }
  from "@nestjs/common";
import { BlogsQueryRepository } from "../../inf/blogs.q.repo";
import { BlogsRepository } from "../../inf/blogs.db.repo";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { join } from "node:path";
import { makeErorrMessage } from "../../../application/make.error.message";
import { S3StorageAdapter } from "../../../adapters/files.storage.adapter";
import { PostsQueryRepository } from "../../../posts/inf/posts.q.repo";
import { PostsRepository } from "../../../posts/inf/posts.db.repo";
import {
  emptyDirAsync, existDirAsync, makeDirAsync, makeRootPath, readFileAsync
} from "../../../utils/fs-utils";
import { PostImage } from "../../../posts/dom/post.entity.images";

export class UploadPostMainImageCommand {
  constructor(
    public blogId: string,
    public postId: string,
    public userId: string,
    public file: Express.Multer.File
  ) {
  };
};

@CommandHandler(UploadPostMainImageCommand)
export class UploadPostMainImageUseCase
  implements ICommandHandler<UploadPostMainImageCommand> {
  constructor(
    protected blogsQueryRepository: BlogsQueryRepository,
    protected blogsRepository: BlogsRepository,
    protected postsQueryRepository: PostsQueryRepository,
    protected postsRepository: PostsRepository,
    private fileStorageAdapter: S3StorageAdapter
  ) {
  };

  async execute(command: UploadPostMainImageCommand) {
    const metadata = await this.validateImage(command.file);

    const { middleImg, smallImg } = await this
      .getMiddleAndSmallImage(command.file.buffer, command.file.originalname);

    // console.log(middleImg);
    // console.log(smallImg);

    const highImg = { ...command.file };
    highImg.originalname = `high_${highImg.originalname}`;

    console.log(highImg);

    const blog = await this.blogsQueryRepository.getRawBlogSQL(command.blogId);

    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== command.userId)
      throw new ForbiddenException();

    const post = await this.postsQueryRepository.getPostSQL(command.postId);
    if (!post) throw new NotFoundException();
    if (post.blogId !== command.blogId) throw new NotFoundException();

    const imageInfo = await this.postsRepository.getImageInfo(post.id);
    console.log(imageInfo);

    const images = [highImg, middleImg, smallImg];

    if (!imageInfo) {
      for (let img of images) {
        const savedImg = await this.fileStorageAdapter
          .savePostImage(blog.id, post.id, img);
        if (!savedImg) throw new NotFoundException();

        const metadata = await sharp(img.buffer).metadata();

        const postImage = new PostImage();

        postImage.type = img.originalname.split("_")[0];
        postImage.url = savedImg.url;
        postImage.eTag = savedImg.fileId;
        postImage.width = metadata.width;
        postImage.height = metadata.height;
        postImage.fileSize = img.size;
        postImage.addedAt = new Date().toISOString();
        postImage.postId = post.id;

        const saveImage = await this.postsRepository.savePostImage(postImage);
        if (!saveImage) throw new NotFoundException();
      }

      // await emptyDirAsync("temp");
    }

    const viewImages = await this.postsQueryRepository.getImageInfo(post.id);
    if (!viewImages) throw new NotFoundException();
    return viewImages;
  };

  async validateImage(image: any) {
    if (!image) throw new NotFoundException();

    const formats = ["image/jpeg", "image/jpg", "image/png"];

    if (!formats.includes(image.mimetype)) throw new BadRequestException(
      [{ message: makeErorrMessage("mimetype").message, field: "mimetype" }]);

    const errors = [];
    const metadata = await sharp(image.buffer).metadata();

    if (metadata.size > 1024 * 100) errors.push("size");
    if (metadata.width !== 940) errors.push("width");
    if (metadata.height !== 432) errors.push("height");
    if (errors.length !== 0) {
      const formatErr = errors.map(err =>
        ({ message: makeErorrMessage(err).message, field: err }));

      throw new BadRequestException(formatErr);
    }
    return metadata;
  };

  async getMiddleAndSmallImage(file: any, fileName: string) {
    // const rootPath = makeRootPath(__dirname);
    //
    // const isTempFolderExist = await existDirAsync("temp");
    // if (!isTempFolderExist) await makeDirAsync("temp");

    // const middleResize = await sharp(file).resize(300, 180)
    //   .toFile(join(rootPath, "temp", `middle_${fileName}`));
    //
    // const middleFileBuffer = await readFileAsync(
    //   join("temp", `middle_${fileName}`));
    //
    // const smallResize = await sharp(file).resize(149, 96)
    //   .toFile(join(rootPath, "temp", `small_${fileName}`));
    //
    // const smallFileBuffer = await readFileAsync(
    //   join("temp", `small_${fileName}`));

    const middleBuffer = await sharp(file).resize(300, 180)
      .toBuffer();
    const middleMetaData = await sharp(middleBuffer).metadata();

    const smallBuffer = await sharp(file).resize(149, 96)
      .toBuffer();
    const smallMetaData = await sharp(middleBuffer).metadata();

    const middleImg = {
      fieldname: "file",
      encoding: "7bit",
      mimetype: `image/${middleMetaData.format}`,
      originalname: `middle_${fileName}`,
      buffer: middleBuffer,
      size: middleMetaData.size
    };

    const smallImg = {
      ...middleImg,
      originalname: `small_${fileName}`,
      buffer: smallBuffer,
      size: smallMetaData.size
    };

    return { middleImg, smallImg };
  }
};