import * as z from "zod";
import { CSVParser } from "./CSVParser";

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});

const csvParser = new CSVParser(userSchema);

describe("CSVParser", () => {
  test("parses a CSV string with header row", () => {
    const csvString = `name,age,email
John Doe,30,johndoe@example.com
Jane Doe,25,janedoe@example.com`;

    const parsedValues = csvParser.parse(csvString);
    expect(parsedValues).toEqual([
      { name: "John Doe", age: 30, email: "johndoe@example.com" },
      { name: "Jane Doe", age: 25, email: "janedoe@example.com" },
    ]);
  });

  test("parses a CSV string without header row", () => {
    const csvString = `John Doe,30,johndoe@example.com
Jane Doe,25,janedoe@example.com`;

    const parsedValues = csvParser.parse(csvString, false);
    expect(parsedValues).toEqual([
      { name: "John Doe", age: 30, email: "johndoe@example.com" },
      { name: "Jane Doe", age: 25, email: "janedoe@example.com" },
    ]);
  });

  test("throws an error on invalid CSV string", () => {
    const csvString = `name,age,email
John Doe,30,johndoe@example.com
Jane Doe,25`;

    expect(() => csvParser.parse(csvString)).toThrow(
      "CSV parsing error: Too few fields: expected 3 fields but parsed 2"
    );
  });

  test("throws an error on invalid data types", () => {
    const csvString = `name,age,email
John Doe,30,johndoe@example.com
Jane Doe,twenty-five,janedoe@example.com`;

    expect(() => csvParser.parse(csvString)).toThrow();
  });
});
