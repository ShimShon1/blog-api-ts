import { Request } from "express";
import { IncomingHttpHeaders } from "http";

type AuthRequest = Request & {
  headers: IncomingHttpHeaders & {
    authorization: string;
  };
};
