/**
 * Parse a Fetch API Response body as JSON; on failure return `{ raw: text }`.
 */
export async function parseJsonResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}
