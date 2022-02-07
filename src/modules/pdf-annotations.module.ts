import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PdfAnnotations } from "../models/PdfAnnotations";

import { PdfAnnotationsController } from "../controllers/pdf-annotations.controller";
import { PdfAnnotationService } from "../services/pdf-annotation.service";

@Module({
  imports: [TypeOrmModule.forFeature([PdfAnnotations])],
  controllers: [PdfAnnotationsController],
  providers: [PdfAnnotationService],
  exports: [PdfAnnotationService],
})
export class PdfAnnotationModule {}
