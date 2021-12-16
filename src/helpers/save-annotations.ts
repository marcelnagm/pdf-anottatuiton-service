import { getConnection, getRepository } from "typeorm";
import { Annotations } from "../models/Annotations";
import { PdfAnnotations } from "../models/PdfAnnotations";

export const saveAnnotationAfterQueue = async (
  pdf_id: string,
  created_by_id: string,
  formattedAnnotations: any,
  id?: string
) => {
  const annotationsRepository =
    getConnection("default").getRepository(Annotations);
  console.log("entrou", formattedAnnotations);
  const pdfAnnotationsRepository = getRepository(PdfAnnotations);

  if (!id) {
    const createdPdfAnnotation = await pdfAnnotationsRepository.save({
      pdf_id,
      created_by_id,
      annotations: [formattedAnnotations],
    });

    return createdPdfAnnotation;
  }

  await annotationsRepository.save(formattedAnnotations);

  await pdfAnnotationsRepository.update({ id }, { updated_at: new Date() });
};
