import { HttpStatus } from "@nestjs/common";
import {
  AnswerViewModel,
  GamePairViewModel,
  MyStatisticViewModel,
  sw_Paginator_GamePairViewModel, sw_Paginator_TopUserViewModel
} from "../quiz.types";
import { pageNumber, pageSize, sortBy, sortDirection, UnauthorizedError } from "../../swagger.info";
import { APIErrorResult } from "../../types";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "Game not found"
};

const ForbiddenError = {
  status: HttpStatus.FORBIDDEN,
  description: "If current user tries to get pair in which user is not participant"
};

const ForbiddenError1 = {
  status: HttpStatus.FORBIDDEN,
  description: "If current user is already participating in active pair"
};

const ForbiddenError2 = {
  status: HttpStatus.FORBIDDEN,
  description: "If current user is already participating in active pair"
};

export const badRequestError1 = {
  status: HttpStatus.BAD_REQUEST,
  description: "Param has error",
  type: APIErrorResult
};

export const sw_getTopUsers = {
  summary: { summary: "Get users top" },
  sort: {
    name: "sort",
    isArray: true,
    type: String,
    required: false,
    description: "Sort param (default: ?sort=avgScores desc&sort=sumScore desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show games with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show games with pass pageSize (default: 10)"
  },
  status200: {
    status: HttpStatus.OK,
    description: "Top was returned",
    type: sw_Paginator_TopUserViewModel
  }
};

export const sw_getMyStatistic = {
  summary: { summary: "Return user's game statistic" },
  status200: {
    status: HttpStatus.OK,
    description: "Statistic was returned",
    type: MyStatisticViewModel
  },
  status401: UnauthorizedError
};

export const sw_getMyGames = {
  summary: { summary: "Return all user's games" },
  sortBy: {
    ...sortBy,
    description: "Sorting games by param (default: pairCreatedDate)"
  },
  sortDirection: {
    ...sortDirection,
    description: "Show games with sortDirection (default: desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show games with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show games with pass pageSize (default: 10)"
  },
  status200: {
    status: HttpStatus.OK,
    description: "Games was returned",
    type: sw_Paginator_GamePairViewModel
  },
  status401: UnauthorizedError
};

export const sw_getCurrentGame = {
  summary: { summary: "Return current unfinished user game" },
  status200: {
    status: HttpStatus.OK,
    description: "Game was returned",
    type: GamePairViewModel
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_getGameById = {
  summary: { summary: "Return game by id" },
  status200: {
    status: HttpStatus.OK,
    description: "Game was returned",
    type: GamePairViewModel
  },
  status400: badRequestError1,
  status401: UnauthorizedError,
  status403: ForbiddenError,
  status404: NotFoundError
};

export const sw_connectToGame = {
  summary: { summary: "Connect user to game or create new game" },
  status200: {
    status: HttpStatus.OK,
    description: "Return exist or new game",
    type: GamePairViewModel
  },
  status401: UnauthorizedError,
  status403: ForbiddenError1
};

export const sw_sendAnswer = {
  summary: { summary: "Send next answer in active game" },
  status200: {
    status: HttpStatus.OK,
    description: "Return answer result",
    type: AnswerViewModel
  },
  status401: UnauthorizedError,
  status403: ForbiddenError2
};