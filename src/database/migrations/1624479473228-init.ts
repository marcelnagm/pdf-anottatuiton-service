import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Init1624479473228 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS CITEXT;`);

    await queryRunner.query(`CREATE OR REPLACE FUNCTION update_updated_at_column() 
    RETURNS TRIGGER AS $$
    BEGIN 
      NEW.updated_at = now(); 
      RETURN NEW; 
    END;
    $$ language 'plpgsql';`);

    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: "pdf_annotations",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "teacher_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "pdf_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_by_id",
            type: "varchar",
            isNullable: false,
          },

          {
            name: "class_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
            onUpdate: "now()",
          },
        ],
      }),
      false
    );

    await queryRunner.createTable(
      new Table({
        name: "annotations",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "annotation",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "pdf_annotation_id",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: true,
            default: "now()",
            onUpdate: "now()",
          },
        ],
      }),
      false
    );

    await queryRunner.createForeignKey(
      "annotations",
      new TableForeignKey({
        columnNames: ["pdf_annotation_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "pdf_annotations",
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "logs",
        columns: [
          {
            name: "id",
            type: "int4",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "level",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "message",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "meta",
            type: "json",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: true,
            default: "now()",
            onUpdate: "now()",
          },
        ],
      }),
      false
    );
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP FUNCTION update_updated_at_column CASCADE;`);
    await queryRunner.dropTable("annotations");
    await queryRunner.dropTable("pdf_annotations");
    await queryRunner.dropTable("logs");
  }
}
