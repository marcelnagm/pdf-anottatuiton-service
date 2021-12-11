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

@ApiTags("# Annotations")
@Controller("annotations") //Decorator recebe como parametro qual e a url
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationService) {}

  @Get()
  async index(@Query() query, @Request() req) {
    return {
      message: "Index",
      object: "users",
      url: req.url,
      data: await this.annotationsService.index(query),
    };
  }
}
