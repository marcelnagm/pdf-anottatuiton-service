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
import { getToken } from "../helpers";

@ApiTags("# Annotations")
@Controller("annotations")
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationService) {}
  @Get()
  async index(@Query() query, @Request() req) {
    return {
      message: "Index",
      object: "annotations",
      url: req.url,
      data: await this.annotationsService.index(query),
    };
  }

  @Post()
  async create(@Body() body, @Request() req) {
    return {
      message: "Create",
      object: "annotations",
      url: req.url,
      data: await this.annotationsService.create(body),
    };
  }

  @Delete(":annotation_id/pdf/:pdf_id/users/:created_by_id")
  async delete(@Param() params, @Request() req) {
    return {
      message: "Delete",
      object: "annotations",
      url: req.url,
      data: await this.annotationsService.delete(params),
    };
  }
}
