import { z } from "zod";
import { Prompt } from "./index";
describe("prompt", () => {
  it("should work", () => {
    const a = new Prompt(
      `Hello {{name}}, you are {{age}} years old.`,
      z.object({ name: z.string().email(), age: z.number() }),
      {
        trim: true,
      }
    );
    a.setVariables({
      name: "Dr.    John    Mcgover    ",
      age: 2,
    });
    expect(a.parseText()).toEqual(
      "Hello Dr. John Mcgover, you are 2 years old."
    );
    expect(a.toJson()).toEqual({
      text: "Hello {{name}}, you are {{age}} years old.",
      variableNames: ["name", "age"],
      variables: {
        name: "Dr.    John    Mcgover    ",
        age: 2,
      },
    });
  });

  it("should give shape of the prompt", () => {
    const a = new Prompt(
      `Hello {{name}}, you are {{age}} years old.`,
      z.object({ name: z.string(), age: z.number() })
    );

    expect(a.toJson()).toEqual({
      text: "Hello {{name}}, you are {{age}} years old.",
      variableNames: ["name", "age"],
      variables: {},
    });
  });
});
