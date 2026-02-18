import OpenAI from "openai";

// Lazy initialization — only created when first accessed at runtime
let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

// Convenience export (throws at runtime if key missing, not at import time)
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getOpenAI() as any)[prop];
  },
});
