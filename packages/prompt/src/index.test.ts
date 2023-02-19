import { z } from "zod";
import { Prompt } from "./index";
describe("prompt", () => {
  it("should work", () => {
    const a = new Prompt(
      `Hello {{name}}, you are {{age}} years old.`,
      z.object({ name: z.string(), age: z.number() }),
      {
        trim: true,
      }
    );
    a.setVariables({
      name: "Dr.    John    Mcgover    ",
      age: "2",
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

  it("long Prompt", () => {
    const a = new Prompt(
      `
You are a very smart teacher helping a student learn English as a second language.
Generate a list of the most common vocabulary words for the specified topic.
Focus on the basic verbs and nouns.
Don't include expressions where the indvidual words can be learned separately.
Don't include proper nouns (trademarks, names, cities, etc).

Topic: Cooking
Description: Utensils, dishware, kitchen devices, recipes, common ingredients
Vocabulary: knife, spoon, fork, teaspoon, tablespoon, measuring cup, mixer, blender, pot, pan, juicer, cutting board, dishwasher, wash, rinse, dry, towel, paper towel, refrigerator, freezer, ice cube, grater, bowl, plate, platter, serving bowl, herbs, meat, vegetables, bread, dough, rice, flour, salad, casserole, recipe, boil, steam, cook, bake

Subject: Getting to know someone
Description: Asking questions, listening carefully, sharing personal information, showing interest and curiosity
Vocabulary: question, listen, share, information, interest, curiosity, history, family, friends, schools, work, hobbies, activities, tastes, opinions, values, beliefs, ambitions, goals, dreams, projects

Topic: {{topic}}
Description: {{description}}
Vocabulary:
`,
      z.object({
        topic: z.string(),
        description: z.number().positive().min(200),
      })
    );
    // TODO: fix this
    // expect(
    //   a.setVariables({
    //     topic: "Cooking",
    //     description: 10,
    //   })
    // ).toThrowError();
    // console.log(a.parseText());
  });
});
