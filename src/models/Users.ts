import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Index("UQ_97672ac88f789774dd47f7c8be3", ["email"], { unique: true })
@Index("UQ_c0d176bcc1665dc7cb60482c817", ["passwordResetToken"], {
  unique: true,
})
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("varchar", { name: "name" })
  name: string;

  @Column("varchar", { name: "email", unique: true })
  email: string;

  @Column("varchar", { name: "role_id" })
  role_id: number;

  @Column("varchar", { name: "password", select: false })
  password: string;

  @Column("varchar", {
    name: "password_reset_token",
    nullable: true,
    unique: true,
    select: false,
  })
  passwordResetToken: string | null;

  @Column("date", { name: "birthdate" })
  birthdate: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
