import { Request, Response, NextFunction } from "express";

export function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const storedPassword = process.env.password || "";
  const encodedPassword = Buffer.from(storedPassword, "binary").toString(
    "base64"
  );
  const passwordFromHeader = req.headers.authorization?.split(" ")[1];
  if (encodedPassword === passwordFromHeader) {
    return next();
  } else {
    res.sendStatus(401);
  }
}
