import {
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

export const getToken = (authorization: string) => {
  if (!authorization) return;

  const [Bearer, token] = authorization.split(" ");

  if (Bearer !== "Bearer" || !token) {
    throw new HttpException(
      {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Authorization wrong format",
      },
      HttpStatus.BAD_REQUEST
    );
  }

  return token;
};
