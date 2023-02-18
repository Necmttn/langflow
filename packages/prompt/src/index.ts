import * as z from "zod";
import nlp from "compromise";

type Test = ExtractVariables<"Hello {{name}}, you are {{age}} years old.">;
type a =
  ExtractVariables<"Hello my name is {{name}} and i'm {{age}} years old. my husband  was {{doctor}}">;

export type ExtractVariables<T extends string> =
  T extends `${infer Left}{{${infer Name}}}${infer Right}`
    ? { [K in TrimSpaces<Name>]: any } & ExtractVariables<Right> &
        ExtractVariables<Left>
    : {};

export type TrimSpaces<S extends string> = S extends ` ${infer Rest}`
  ? TrimSpaces<Rest>
  : S extends `${infer Rest} `
  ? TrimSpaces<Rest>
  : S;

const PromptParserOptions = {
  trim: true, // remove leading/trailing whitespace
  keepSpace: false, // tabs, double-spaces
  unicode: false, // ü → u
  case: false, // co-erce everything to lowercase
  titlecase: false, // titlecase proper-nouns, acronyms, sentence-starts
  keepPunct: true, // '?!' → ?
  acronyms: false, // F.B.I. → FBI
  abbreviations: false, // Mrs. → Mrs
  implicit: false, // didn't → 'did not'
};

export class Prompt<
  T extends string,
  V extends z.ZodObject<{
    [K in keyof ExtractVariables<T>]: z.ZodType;
  }>
> {
  private readonly text: string;
  private readonly schema: V;
  private variables: Partial<z.infer<V>> = {};

  constructor(
    text: T,
    schema: V,
    public readonly parserOptions: Partial<
      typeof PromptParserOptions
    > = PromptParserOptions
  ) {
    this.text = text;
    this.schema = schema;
  }

  setVariables(variables: z.infer<V>): Prompt<T, V> | z.ZodError {
    this.variables = this.schema.parse(variables);
    return this;
  }

  public get variableNames() {
    const regex = /{{\s*([\w\d]+)\s*}}/g;
    const variableNames = Array.from(this.text.matchAll(regex))?.map(
      (e) => e[1]
    );
    return variableNames;
  }

  public parseText(): string {
    if (!this.variables) {
      throw new Error("Variables not set");
    }

    const variableRegex = /{{\s*([\w\d]+)\s*}}/g;
    const parsedText = this.text.replace(
      variableRegex,
      (match: string, variableName) => {
        if (!this.variableNames.includes(variableName)) {
          throw new Error(`Variable ${variableName} is not defined`);
        }

        const variableValue = this.variables![
          variableName.trim() as keyof z.infer<V>
        ] as string;
        if (variableValue === undefined || variableValue === null) {
          throw new Error(`Variable ${variableName} is not defined`);
        }

        return nlp(variableValue).normalize({ whitespace: true }).trim().text();
      }
    );
    const prompt = nlp(parsedText);
    prompt.normalize({ whitespace: true });

    return prompt.text();
  }

  public toJson() {
    return {
      text: this.text,
      variableNames: this.variableNames,
      variables: this.variables,
    };
  }
}
