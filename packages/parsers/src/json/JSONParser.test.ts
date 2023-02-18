import * as z from "zod";
import { JSONParser } from "./JSONParser";

describe("JSONParser", () => {
  const userSchema = z.object({
    name: z.string(),
    age: z.number(),
    email: z.string().email(),
  });

  const jsonParser = new JSONParser(z.array(userSchema));

  it("should parse a valid JSON array of objects based on the provided schema", () => {
    const jsonString = `[
      {
        "name": "John Doe",
        "age": 30,
        "email": "johndoe@example.com"
      },
      {
        "name": "Jane Doe",
        "age": 25,
        "email": "janedoe@example.com"
      }
    ]`;

    const parsedValue = jsonParser.parse(jsonString);

    expect(parsedValue).toEqual([
      {
        name: "John Doe",
        age: 30,
        email: "johndoe@example.com",
      },
      {
        name: "Jane Doe",
        age: 25,
        email: "janedoe@example.com",
      },
    ]);
  });

  it("should throw an error if the JSON array of objects is invalid based on the provided schema", () => {
    const jsonString = `[
      {
        "name": "John Doe",
        "age": "30",
        "email": "johndoe@example.com"
      },
      {
        "name": "Jane Doe",
        "age": 25,
        "email": "janedoe@example.com"
      }
    ]`;

    expect(() => {
      jsonParser.parse(jsonString);
    }).toThrow(z.ZodError);
  });
});
