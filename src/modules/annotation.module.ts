import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Annotations } from "../models/Annotations";

import { AnnotationsController } from "../controllers/annotations.controller";

import { AnnotationService } from "../services/annotation.service";
import { PdfAnnotations } from "../models/PdfAnnotations";

@Module({
  imports: [
    TypeOrmModule.forFeature([Annotations]),
    TypeOrmModule.forFeature([PdfAnnotations]),
  ],
  controllers: [AnnotationsController],
  providers: [AnnotationService],
  exports: [AnnotationService],
})
export class AnnotationModule {}
