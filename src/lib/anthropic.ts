import Anthropic from "@anthropic-ai/sdk";

// Lazy initialization — only created when first accessed at runtime
let _anthropic: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!_anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _anthropic;
}

// Convenience export (throws at runtime if key missing, not at import time)
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getAnthropic() as any)[prop];
  },
});
