import {
  CompletionsModelProvider,
  EmbeddingsModelProvider,
  ModelProvider,
  ModelProviderType,
} from "..";
import { Configuration, OpenAIApi, CreateEmbeddingRequest } from "openai";
import {
  DEFAULT_COMPLETION_OPTIONS,
  DEFAULT_OPENAI_EMBEDDINGS_CONFIG,
} from "./openai.constants";
import { OpenAITokenizer } from "./openai.tokenizer";
import {
  GenerateCompletionOptions,
  OpenAIEmbeddingsConfig,
} from "./openai.type";

class OpenAIConfiguration extends Configuration {}

export class OpenAI
  extends ModelProvider
  implements CompletionsModelProvider, EmbeddingsModelProvider
{
  apiKey: string;
  config: OpenAIConfiguration;
  api: OpenAIApi;
  completionsConfig = DEFAULT_COMPLETION_OPTIONS;
  embeddingsConfig: OpenAIEmbeddingsConfig = DEFAULT_OPENAI_EMBEDDINGS_CONFIG;
  tokenizer: OpenAITokenizer = new OpenAITokenizer();

  constructor(apiKey: string) {
    super(ModelProviderType.OpenAI);
    this.apiKey = apiKey;

    const config = new OpenAIConfiguration({
      apiKey,
    });

    this.config = config;

    this.api = new OpenAIApi(config);
  }

  countTokens(text: string) {
    return this.tokenizer.countTokens(text);
  }

  async generate(
    promptText: string,
    options: GenerateCompletionOptions = DEFAULT_COMPLETION_OPTIONS
  ) {
    try {
      const res = await this.api.createCompletion({
        prompt: promptText,
        ...options,
        model: options.model || DEFAULT_COMPLETION_OPTIONS.model,
      });

      return res.data.choices[0]?.text || "";
    } catch (e) {
      console.log(e);
    }
    return "failed";
  }

  /**
   * Use this on your server to stream completions from the OpenAI API.
   *
   * @param promptText
   * @param options
   * @returns
   */
  async stream(
    promptText: string,
    options: Omit<
      GenerateCompletionOptions,
      "stream"
    > = DEFAULT_COMPLETION_OPTIONS
  ) {
    try {
      const stream = this.api.createCompletion(
        {
          stream: true,
          model: options.model || DEFAULT_COMPLETION_OPTIONS.model,
          prompt: promptText,
          ...options,
        },
        {
          responseType: "stream",
        }
      );
      return stream;
    } catch (e) {
      console.log(e);
    }
  }

  async embed(
    text: string,
    options?: Omit<CreateEmbeddingRequest, "input">
  ): Promise<number[]>;
  async embed(
    texts: string[],
    options?: Omit<CreateEmbeddingRequest, "input">
  ): Promise<number[][]>;
  async embed(
    textOrTexts: any,
    options: Omit<
      CreateEmbeddingRequest,
      "input"
    > = DEFAULT_OPENAI_EMBEDDINGS_CONFIG
  ) {
    if (Array.isArray(textOrTexts)) {
      return this.embedMany(textOrTexts, options);
    } else {
      return this.embedOne(textOrTexts, options);
    }
  }

  private embedOne = async (
    text: string,
    options: Omit<CreateEmbeddingRequest, "input">
  ) => {
    const result = await this.api.createEmbedding({
      ...options,
      input: text.replace(/\n/g, " "),
    });

    return result?.data.data[0].embedding;
  };

  private embedMany = async (
    texts: string[],
    options: Omit<CreateEmbeddingRequest, "input">
  ) => {
    const batchResults = await Promise.all(
      texts.map((text) =>
        this.api.createEmbedding({
          ...options,
          input: text.replace(/\n/g, " "),
        })
      )
    );

    return batchResults.map((result) => result?.data.data[0].embedding);
  };
}
