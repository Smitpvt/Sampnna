type Meta = Record<string, string | number | boolean | null | undefined>;

/**
 * Structured, PII-free logging. Pass identifiers and counts only — never
 * names, emails, phone numbers, message bodies, IPs or secrets.
 */
function write(level: "info" | "warn" | "error", event: string, meta: Meta = {}) {
  const line = JSON.stringify({ level, event, ...meta, at: new Date().toISOString() });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

export const logger = {
  info: (event: string, meta?: Meta) => write("info", event, meta),
  warn: (event: string, meta?: Meta) => write("warn", event, meta),
  error: (event: string, err: unknown, meta?: Meta) =>
    write("error", event, { ...meta, error: err instanceof Error ? `${err.name}: ${err.message}` : "unknown" }),
};

