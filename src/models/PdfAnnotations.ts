import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Annotations } from "./Annotations";

@Entity("pdf_annotations", { schema: "public" })
export class PdfAnnotations {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  teacher_id: string;

  @Column("uuid")
  class_id: string;

  @Column("uuid")
  pdf_id: string;

  @Column("uuid")
  created_by_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => Annotations,
    (annotations) => annotations.pdf_annotation_id,
    { cascade: true }
  )
  annotations: Annotations[];
}
