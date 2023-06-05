import {
  ValidatorConstraint, ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { Types } from 'mongoose';
import { BlogsQueryRepository } from "../blogs/inf/blogs.q.repo";
import { Injectable } from "@nestjs/common";

@ValidatorConstraint({ name: 'CheckBlogId', async: true })
@Injectable()
export class CheckBlogId implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {};

  async validate(id: string, args: ValidationArguments) {
    if(!id) return false;
    // if(!Types.ObjectId.isValid(id)) return false;

    // console.log(this.blogsQueryRepository);
    const blog = await this.blogsQueryRepository.getRawBlogSQL(id);
    // console.log(blog);
    if(blog) return true;
    else return false;
    // for async validations you must return a Promise<boolean> here
  };

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Id is not Found';
  };
};