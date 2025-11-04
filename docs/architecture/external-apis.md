# External APIs

### OpenAI Vision API

- **Purpose:** Parse printed text from uploaded images containing math problems
- **Documentation:** https://platform.openai.com/docs/guides/vision
- **Base URL:** `https://api.openai.com/v1/chat/completions`
- **Authentication:** API key in request headers (stored in environment variables)
- **Rate Limits:** Varies by tier (typically 10,000 tokens/minute)

**Key Endpoints Used:**

- `POST /v1/chat/completions` - Image parsing with vision model (GPT-4 Vision or GPT-4o)

**Integration Notes:**

- Image preprocessing may be required (resize, format conversion)
- Error handling for parsing failures with fallback to text input
- Cost optimization: Only parse when image upload is selected
- Supports image formats: JPG, PNG, GIF, WebP

### OpenAI GPT-4 API (or Claude API)

- **Purpose:** Problem validation, type identification, and Socratic dialogue generation
- **Documentation:**
  - OpenAI: https://platform.openai.com/docs/api-reference
  - Anthropic: https://docs.anthropic.com/claude/reference
- **Base URL(s):**
  - OpenAI: `https://api.openai.com/v1/chat/completions`
  - Anthropic: `https://api.anthropic.com/v1/messages`
- **Authentication:** API key in request headers (stored in environment variables)
- **Rate Limits:**
  - OpenAI: Varies by tier (typically 10,000 tokens/minute)
  - Anthropic: Varies by tier

**Key Endpoints Used:**

- `POST /v1/chat/completions` (OpenAI) - Chat completion for dialogue generation
- `POST /v1/messages` (Anthropic) - Message completion for dialogue generation

**Integration Notes:**

- Two-tier usage: Primary for dialogue generation, secondary for answer validation
- Prompt engineering critical for Socratic compliance
- Response time optimization: Use streaming for faster perceived response times
- Cost management: Monitor token usage, implement caching where appropriate
