import type { IncomingMessage, ServerResponse } from "http";
import { app } from "../server/index.js";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  app(req, res);
}
