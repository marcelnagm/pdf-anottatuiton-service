import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { PdfAnnotations } from "./models/PdfAnnotations";
import { Logs } from "./models/Logs";
import { Annotations } from "./models/Annotations";
import { Users } from "./models/Users";

import { App1Module } from "./modules/app1.module";
import { HealthModule } from "./modules/health.module";
import { UserModule } from "./modules/user.module";
import { AnnotationModule } from "./modules/annotation.module";
import { PdfAnnotationModule } from "./modules/pdf-annotations.module";

import { AuthMiddleware } from "./middlewares/auth.middleware";
import { GrayLoggerTypeOrm } from "./helpers/graylog";
import {
  DB_USE,
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE,
  LOGGING_TYPEORM,
  NODE_ENV,
  MIGRATIONS_RUN_AUTOMATIC,
  SYNCHRONIZE_TYPEORM_DB,
  ACTIVATE_GRAYLOG,
} from "./config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: DB_USE,
        host: DATABASE_HOST,
        port: DATABASE_PORT,
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE,
        autoLoadEntities: true,
        synchronize:
          NODE_ENV === "development" ? SYNCHRONIZE_TYPEORM_DB : false,
        logging: LOGGING_TYPEORM,
        migrations: ["dist/database/migrations/*{.ts,.js}"],
        migrationsTableName: "migrations_typeorm",
        migrationsRun: MIGRATIONS_RUN_AUTOMATIC,

        logger:
          ACTIVATE_GRAYLOG === true
            ? new GrayLoggerTypeOrm({
                application: configService.get<string>("GRAYLOG_APPLICATION"),
                applicationName: configService.get<string>(
                  "GRAYLOG_APPLICATION_NAME"
                ),
                productName: configService.get<string>("GRAYLOG_NAME"),
                environment: configService.get<string>("GRAYLOG_ENVIRONMENT"),
                servers: [
                  {
                    host: configService.get<string>("GRAYLOG_HOST"),
                    port: parseInt(configService.get<string>("GRAYLOG_PORT")),
                  },
                ],
              })
            : null,
      }),
    }),
    TypeOrmModule.forFeature([Annotations, PdfAnnotations, Logs, Users]),
    HealthModule,
    App1Module,
    UserModule,
    AnnotationModule,
    PdfAnnotationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "/health", method: RequestMethod.GET },
        { path: "/users/signup", method: RequestMethod.POST },
        { path: "/users/login", method: RequestMethod.POST },
        { path: "/annotations", method: RequestMethod.GET },
        { path: "/annotations", method: RequestMethod.POST },
        {
          path: "/annotations/:id/pdf/:pdf_id/users/:created_by_id",
          method: RequestMethod.DELETE,
        },
        { path: "/pdf-annotations", method: RequestMethod.GET },
        { path: "/annotations/queue", method: RequestMethod.POST }
      )
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
