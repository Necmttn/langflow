import * as z from "zod";

export class JSONParser<T extends z.ZodTypeAny> {
  private schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  parse(jsonString: string): z.infer<T> {
    const parsedJson = JSON.parse(jsonString);
    return this.schema.parse(parsedJson);
  }
}
