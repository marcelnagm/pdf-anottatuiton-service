import { env } from "./helpers";

export const CONFIG = {
  API_VERSION: "0.0.1",
  API_HEALTH_MESSAGE: "Api is Ok!",
};

//Variaveis do .env
export const JWT_PRIVATE_KEY: string = env("JWT_PRIVATE_KEY", "mysupersecret");
export const HTTP_PORT: number = env("HTTP_PORT", 3000);
export const NODE_ENV: string = env("NODE_ENV", "development");
export const DB_USE: any = env("DB_USE");
export const DATABASE_HOST: string = env("DATABASE_HOST", "localhost");
export const DATABASE_PORT: number = env("DATABASE_PORT", 3306);
export const DATABASE_USER: string = env("DATABASE_USER");
export const DATABASE_PASSWORD: string = env("DATABASE_PASSWORD");
export const DATABASE: string = env("DATABASE");
export const LOGGING_TYPEORM: boolean = eval(env("LOGGING_TYPEORM", false));
export const MIGRATIONS_RUN_AUTOMATIC: boolean = eval(
  env("MIGRATIONS_RUN_AUTOMATIC", false)
);
export const SYNCHRONIZE_TYPEORM_DB: boolean = eval(
  env("SYNCHRONIZE_TYPEORM_DB", false)
);
export const ACTIVATE_GRAYLOG: boolean = eval(env("ACTIVATE_GRAYLOG", false));

export const REDIS_HOST: string = env("REDIS_HOST", "localhost");
export const REDIS_PORT: string = env("REDIS_PORT", 6379);
export const REDIS_PASSWORD: string = env("REDIS_PASSWORD", "");

export const API_URL: string = env("API_URL", "http://localhost:5000");
export const DLQ_URL_SQS: string = env("DLQ_URL_SQS");
export const AWS_REGION: string = env("AWS_REGION");
export const URL_SQS: string = env("URL_SQS");
export const ARN_DLQ: string = env("ARN_DLQ");
