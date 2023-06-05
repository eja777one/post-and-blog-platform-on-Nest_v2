import { HttpStatus } from "@nestjs/common";
import { Paginator } from "../../types";
import { SAQuestionViewModel, sw_Paginator_SAQuestionViewModel } from "../quiz.types";
import {
  badRequestError,
  bodySearchTerm,
  pageNumber,
  pageSize, publishedStatus,
  sortBy,
  sortDirection,
  UnauthorizedError
} from "../../swagger.info";

const NotFoundError = {
  status: HttpStatus.NOT_FOUND,
  description: "Question was not found"
};

export const sw_getQuestions = {
  summary: { summary: "Return all question with paging" },
  bodySearchTerm: bodySearchTerm,
  publishedStatus: publishedStatus,
  sortBy: {
    ...sortBy,
    description: "Sorting questions by param (default: createdAt)"
  },
  sortDirection: {
    ...sortDirection,
    description: "Show questions with sortDirection (default: desc)"
  },
  pageNumber: {
    ...pageNumber,
    description: "Show questions with pass pageNumber (default: 1)"
  },
  pageSize: {
    ...pageSize,
    description: "Show questions with pass pageSize (default: 10)"
  },
  status200: {
    status: HttpStatus.OK,
    description: "Questions was returned",
    type: sw_Paginator_SAQuestionViewModel
  },
  status401: UnauthorizedError
};

export const sw_createQuestion = {
  summary: { summary: "Create question" },
  status201: {
    status: HttpStatus.CREATED,
    description: "Question was created",
    type: SAQuestionViewModel
  },
  status400: badRequestError,
  status401: UnauthorizedError
};

export const sw_deleteQuestion = {
  summary: { summary: "Delete question" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Question was deleted"
  },
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_updateQuestion = {
  summary: { summary: "Update question" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Question was updated"
  },
  status400: badRequestError,
  status401: UnauthorizedError,
  status404: NotFoundError
};

export const sw_publishQuestion = {
  summary: { summary: "Change publish status" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Publish status was updated"
  },
  status400: badRequestError,
  status401: UnauthorizedError
};