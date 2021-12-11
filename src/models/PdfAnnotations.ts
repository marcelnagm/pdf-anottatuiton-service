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
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer")
  teacher_id: number;

  @Column("integer")
  class_id: number;

  @Column("integer")
  pdf_id: number;

  @Column("integer")
  created_by_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Annotations, (annotations) => annotations.pdf_annotation_id)
  annotations: Annotations[];
}
