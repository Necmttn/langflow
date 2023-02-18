import * as z from "zod";
import { parse, ParseResult } from "papaparse";

export class CSVParser<T extends z.ZodTypeAny> {
  private schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  parse(csvString: string, hasHeaderRow = true): z.infer<T>[] {
    const { data, errors }: ParseResult<z.infer<T>> = parse(csvString, {
      header: hasHeaderRow,
      dynamicTyping: true,
    });

    if (!hasHeaderRow) {
      // If there's no header row, assume the schema fields are in the order they're defined
      const schemaFields = Object.keys(this.schema._def.shape()).map((key: string) => key);

      return data.map((row) => {
        const parsedRow: z.infer<T> = {};
        schemaFields.forEach((field: any, index: number) => {
          parsedRow[field] = this.schema._def.shape()[field].parse(row[index]);
        });
        return parsedRow;
      });
    }

    if (errors.length > 0) {
      throw new Error(`CSV parsing error: ${errors.map(e => e.message).join(", ")}`);
    }

    return data.map((row) => this.schema.parse(row));
  }
}
