export const MAX_PDF_BYTES = 20 * 1024 * 1024;

/**
 * Read a response body only while it remains under the configured byte limit.
 * Returns null when the declared or streamed body is too large (or unavailable).
 */
export async function readResponseWithLimit(
  response: Response,
  maxBytes: number = MAX_PDF_BYTES,
): Promise<ArrayBuffer | null> {
  const declaredLength = response.headers.get('content-length');
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (Number.isFinite(parsedLength) && parsedLength > maxBytes) {
      await response.body?.cancel();
      return null;
    }
  }

  const reader = response.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const output = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output.buffer;
}
