import { Injectable } from "@nestjs/common";
import { join } from "node:path";
import { existDirAsync, makeDirAsync, saveFileAsync, unlinkFileAsync } from "../utils/fs-utils";
// import { SaveFileResultType } from "./sava.avatar.uc";
import {
  CopyObjectCommand,
  DeleteObjectCommand, DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client
} from "@aws-sdk/client-s3";
import { errorHandler } from "../application/error.handler";

// @Injectable()
// export class FileStorageAdapter {
//   private async ensureUserFolder(subFolder: string) {
//     const dirPath = join("content", "users", "10", subFolder);
//
//     const isExist = await existDirAsync(dirPath);
//     if (!isExist) await makeDirAsync(dirPath);
//
//     return dirPath;
//   }
//
//   async saveAvatar(fileName: string, file: Buffer): Promise<SaveFileResultType> {
//     const dirPath = await this.ensureUserFolder("avatars");
//     const relativePath = join(dirPath, fileName);
//     await saveFileAsync(relativePath, file);
//
//     return {
//       url: `content/users/${10}/avatars/${fileName}`,
//       fileId: relativePath
//     };
//
//   };
//
//   async deleteAvatar(fileId: string) {
//     await unlinkFileAsync(fileId);
//   };
// };

@Injectable()
export class S3StorageAdapter {
  s3client: S3Client;
  bucket: string = "pgs111213";

  constructor() {
    const REGION = "us-east-1";
    this.s3client = new S3Client({
      region: REGION,
      endpoint: "https://storage.yandexcloud.net",
      credentials: {
        accessKeyId: process.env.STORAGE_ID,
        secretAccessKey: process.env.STORAGE_KEY
      }
    });
  };

  async savePostImage(blogId: string, postId: string, file: any) {
    let key = `blogs/${blogId}/posts/${postId}/images/${file.originalname}`;

    const bucketParams = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult = await this.s3client.send(command);
      // console.log(uploadResult);
      return { url: key, fileId: uploadResult.ETag };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveBlogWallpaper(blogId: string, file: Express.Multer.File) {
    let key = `blogs/${blogId}/wallpaper/${file.originalname}`;

    const bucketParams = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult = await this.s3client.send(command);
      // console.log(uploadResult);
      return { url: key, fileId: uploadResult.ETag };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveBlogMainImage(blogId: string, file: Express.Multer.File) {
    let key = `blogs/${blogId}/main-image/${file.originalname}`;

    const bucketParams = {
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult = await this.s3client.send(command);
      // console.log(uploadResult);
      return { url: key, fileId: uploadResult.ETag };
    } catch (e) {
      return errorHandler(e);
    }
  };

  async saveAvatar(fileName: string, file: Buffer) {

    let key = `content/users/${10}/avatar/${10}_avatar.png`;

    const bucketParams = {
      Bucket: "pgs111213",
      Key: key,
      Body: file,
      ContentType: "image/png"
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult: PutObjectCommandOutput = await this.s3client.send(command);

      console.log(uploadResult);

      return {
        url: key,
        fileId: uploadResult.ETag
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  async deleteAvatar(filePath: string) {
    const bucketParams = { Bucket: this.bucket, Key: filePath };
    try {
      const data = await this.s3client.send(new DeleteObjectCommand(bucketParams));
      console.log("Success");
      return data;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  async deleteFile(filePath: string) {
    const bucketParams = { Bucket: this.bucket, Key: filePath };
    try {
      const data = await this.s3client.send(
        new DeleteObjectCommand(bucketParams));
      console.log("Success");
      return data;
    } catch (e) {
      return errorHandler(e);
    }
  };

  async deletePostFiles(blogId: string, postId: string) {
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: `blogs/${blogId}/posts/${postId}`
    });

    const list = await this.s3client.send(listCommand);
    console.log(list);

    if (list.KeyCount) {
      const bucketParams = {
        Bucket: this.bucket,
        Delete: {
          Objects: list.Contents.map(el => ({ Key: el.Key })),
          Quiet: false
        }
      };

      const deleteCommand = new DeleteObjectsCommand(bucketParams);

      const deleted = await this.s3client.send(deleteCommand);

      if (deleted.Errors) {
        // deleted.Errors.map((error) => console.log(`${error.Key} could not be deleted - ${error.Code}`));
        return null;
      }
    }

    return true;
  }

  async deleteBlogFiles(blogId: string) {
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: `blogs/${blogId}`
    });

    const list = await this.s3client.send(listCommand);
    console.log(list);

    if (list.KeyCount) {

      const bucketParams = {
        Bucket: this.bucket,
        Delete: {
          Objects: list.Contents.map(el => ({ Key: el.Key })),
          Quiet: false
        }
      };

      const deleteCommand = new DeleteObjectsCommand(bucketParams);

      const deleted = await this.s3client.send(deleteCommand);

      if (deleted.Errors) {
        // deleted.Errors.map((error) => console.log(`${error.Key} could not be deleted - ${error.Code}`));
        return null;
      }
    }

    return true;
  }
};