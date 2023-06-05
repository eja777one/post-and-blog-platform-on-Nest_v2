import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QueryType } from "../../../types";
import { UsersQueryRepository } from "../../inf/users.q.repo";

export class GetUsersBySAQuery {
  constructor(public queryForSearch: QueryType) {
  };
};

@QueryHandler(GetUsersBySAQuery)
export class GetUsersBySAHandler implements IQueryHandler<GetUsersBySAQuery> {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {
  };

  async execute(query: GetUsersBySAQuery) {
    const users = await this.usersQueryRepository
      .getUsersBySASQL(query.queryForSearch);
    return users;
  };
};