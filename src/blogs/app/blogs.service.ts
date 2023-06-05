import {  Injectable } from "@nestjs/common";
import { BlogsRepository } from "../inf/blogs.db.repo";

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {};

};