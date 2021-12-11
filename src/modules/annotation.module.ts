import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Annotations } from "../models/Annotations";

import { AnnotationsController } from "../controllers/annotations.controller";
import { AnnotationService } from "../services/annotation.service";

@Module({
  imports: [TypeOrmModule.forFeature([Annotations])],
  controllers: [AnnotationsController],
  providers: [AnnotationService],
  exports: [AnnotationService],
})
export class AnnotationModule {}
