import { OPENAI_MODEL } from "./openai.type";

export const DEFAULT_COMPLETION_OPTIONS = {
  model: "text-davinci-003" as OPENAI_MODEL,
  max_tokens: 128,
  temperature: 0.7,
  stop: null,
};

export const DEFAULT_OPENAI_EMBEDDINGS_CONFIG = {
  model: "text-embedding-ada-002",
};
