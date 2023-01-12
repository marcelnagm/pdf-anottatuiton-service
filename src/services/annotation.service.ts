import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Annotations } from "../models/Annotations";

import { PdfAnnotationCreateDto } from "../validators/pdf-annotations.dto";

import {
  setInCache,
  getAnnotationsFromCache,
  sendQueueMessage,
  GrayLogger,
} from "../helpers";

import { PdfAnnotations } from "../models/PdfAnnotations";

@Injectable()
export class AnnotationService {
  constructor(
    @InjectRepository(Annotations)
    private annotationsRepository: Repository<Annotations>,

    @InjectRepository(PdfAnnotations)
    private pdfAnnotationsRepository: Repository<PdfAnnotations>
  ) {}

  async index(queryParams: { pdf_id: string }) {
    return this.annotationsRepository
      .createQueryBuilder("annotation")
      .innerJoin("annotation.pdf_annotations", "pdf_annotation")
      .where("pdf_annotation.pdf_id = :pdf_id", { pdf_id: queryParams.pdf_id })
      .getMany();
  }

  async create(body: PdfAnnotationCreateDto) {
    try {
      const { annotations, ...pdfAnnotation } = body;

      const graylog = new GrayLogger();

      graylog.log("create")

      const cacheKey = `${pdfAnnotation.created_by_id}:${pdfAnnotation.pdf_id}`;
      const response = await getAnnotationsFromCache(cacheKey);

      const createdAt = new Date();

      const formattedAnnotations = {
        ...annotations[0],
        ...(pdfAnnotation?.id && { pdf_annotation_id: pdfAnnotation.id }),
      };

      if (!response) {
        await setInCache(cacheKey, {
          created_at: createdAt,
          created_by_id: pdfAnnotation.created_by_id,
          pdf_id: pdfAnnotation.pdf_id,
          annotations: [formattedAnnotations],
        });

        return sendQueueMessage(
          pdfAnnotation.pdf_id,
          pdfAnnotation.created_by_id,
          formattedAnnotations,
          pdfAnnotation?.id
        );
      }

      const annotationsFiltered = response.annotations.filter(
        (annotation) => annotation.annotation_id !== formattedAnnotations.annotation_id
      );
      
      await setInCache(cacheKey, {
        created_at: createdAt,
        created_by_id: pdfAnnotation.created_by_id,
        pdf_id: pdfAnnotation.pdf_id,
        annotations: [...annotationsFiltered, formattedAnnotations],
      });

      return sendQueueMessage(
        pdfAnnotation.pdf_id,
        pdfAnnotation.created_by_id,
        formattedAnnotations,
        pdfAnnotation?.id
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async delete(params: { created_by_id: string; pdf_id: string; annotation_id: string }) {
    const { created_by_id, pdf_id, annotation_id } = params;

    try {
      const cacheKey = `${created_by_id}:${pdf_id}`;

      const { annotations } = await getAnnotationsFromCache(
        cacheKey
      );

      const newAnnotations = annotations.filter(
        (annotation: { annotation_id: string }) => annotation.annotation_id !== annotation_id
      );

      await setInCache(cacheKey, {
        created_at: new Date(),
        created_by_id: created_by_id,
        pdf_id: pdf_id,
        annotations: newAnnotations,
      });

      // // adicionar fila?
      await this.annotationsRepository.delete({ annotation_id: annotation_id });

      return { message: "Deleted with success" };
    } catch (error) {
      throw new BadRequestException(error?.message || error);
    }
  }

  async saveAnnotations(body: any) {
    const { pdf_id, created_by_id, formattedAnnotations } = body;
    const graylog = new GrayLogger()
    graylog.log("saveAnnotations")

    const { annotation_id, annotation } = JSON.parse(formattedAnnotations);

    const annotationInDb = await this.annotationsRepository.findOne({
      annotation_id,
    });

    if (annotationInDb) {
      await this.annotationsRepository.update(
        { annotation_id },
        { annotation }
      );

      return this.pdfAnnotationsRepository.update(
        { pdf_id, created_by_id },
        { updated_at: new Date() }
      );
    }

    const pdfAnnotationDb = await this.pdfAnnotationsRepository.findOne({
      pdf_id,
      created_by_id,
    });

    const createdPdfAnnotation = await this.pdfAnnotationsRepository.save({
      ...(pdfAnnotationDb && { id: pdfAnnotationDb.id }),
      pdf_id,
      created_by_id,
      updated_at: new Date(),
    });

    await this.annotationsRepository.save({
      annotation,
      annotation_id,
      ...(createdPdfAnnotation && {
        pdf_annotation_id: pdfAnnotationDb?.id || createdPdfAnnotation.id,
      }),
    });

    return createdPdfAnnotation;
  }
}
