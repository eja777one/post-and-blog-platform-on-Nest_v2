import { HttpStatus } from "@nestjs/common";
import { GetMyTgAuthViewModel} from "../../types";
import { UnauthorizedError } from "../../swagger.info";

export const sw_setWebhook = {
  summary: { summary: "Webhook for telegram bot api" },
  status204: {
    status: HttpStatus.NO_CONTENT,
    description: "Webhook was set"
  }
};

export const sw_getTelegramLink = {
  summary: { summary: "Get auth bot link with personal user code inside" },
  status200: {
    status: HttpStatus.OK,
    description: "Link was send",
    type: GetMyTgAuthViewModel
  },
  status401: UnauthorizedError
};