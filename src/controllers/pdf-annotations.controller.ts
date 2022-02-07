import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { AnnotationService } from "../services/annotation.service";
import { PdfAnnotationService } from "../services/pdf-annotation.service";

@ApiTags("# PdfAnnotatons")
@Controller("pdf-annotations") //Decorator recebe como parametro qual e a url
export class PdfAnnotationsController {
  constructor(private readonly pdfAnnotationService: PdfAnnotationService) {}

  @Get()
  async index(@Query() query, @Request() req) {
    return {
      message: "Index",
      object: "pdf_annotations",
      url: req.url,
      data: await this.pdfAnnotationService.index(query),
    };
  }
}
