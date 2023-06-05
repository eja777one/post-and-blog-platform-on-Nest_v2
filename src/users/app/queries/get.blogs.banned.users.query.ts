import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QueryType } from "../../../types";
import { UsersQueryRepository } from "../../inf/users.q.repo";
import { BlogsQueryRepository } from "../../../blogs/inf/blogs.q.repo";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

export class GetBlogsBannedUsersQuery {
  constructor(
    public queryForSearch: QueryType,
    public blogId: string,
    public bloggerId: string,
  ) {
  };
};

@QueryHandler(GetBlogsBannedUsersQuery)
export class GetBlogsBannedUsersHandler
  implements IQueryHandler<GetBlogsBannedUsersQuery> {

  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository
  ) {
  };

  async execute(query: GetBlogsBannedUsersQuery) {
    const blog = await this.blogsQueryRepository.getRawBlogSQL(query.blogId);
    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo.userId !== query.bloggerId)
      throw new ForbiddenException();

    const users = await this.usersQueryRepository
      .getBlogsBannedUsersSQL(query.queryForSearch, query.blogId);

    return users;
  };
};