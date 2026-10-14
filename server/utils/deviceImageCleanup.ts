import { del } from '@vercel/blob';

const CLEANUP_ATTEMPTS = 3;
const CLEANUP_TIMEOUT_MS = 2_000;
type DeleteImage = (url: string, options: { abortSignal: AbortSignal }) => Promise<void>;

/** Retry image cleanup without masking a database error or a committed mutation. */
export async function cleanupDeviceImage(url?: string, remove: DeleteImage = del): Promise<void> {
  if (!url) return;

  let failure: unknown;
  for (let attempt = 0; attempt < CLEANUP_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        remove(url, { abortSignal: controller.signal }),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => {
            controller.abort();
            reject(new Error('Device image cleanup timed out'));
          }, CLEANUP_TIMEOUT_MS);
        })
      ]);
      return;
    } catch (error) {
      failure = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  // Keep the URL available for operational recovery if Blob remains unavailable.
  console.error('Device image cleanup failed after retries', { url, error: failure });
}
