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

    await queryRunner.createTable(
      new Table({
        name: "pdf_annotations",
        columns: [
          {
            name: "id",
            type: "int4",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "teacher_id",
            type: "int4",
            isNullable: true,
          },
          {
            name: "pdf_id",
            type: "int4",
            isNullable: false,
          },
          {
            name: "created_by_id",
            type: "int4",
            isNullable: true,
          },

          {
            name: "class_id",
            type: "int4",
            isNullable: true,
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
            type: "int4",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "annotation",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "pdf_annotation_id",
            type: "int4",
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
