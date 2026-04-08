import type { IncomingMessage, ServerResponse } from "http";
import { app } from "../server/index";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res);
}
