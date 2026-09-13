/**
 * Redacted Structured Logger
 * Prevents accidental logging of PII, passwords, OTPs, tokens, or credit cards
 */

const SENSITIVE_KEYS = [
  "password",
  "pass",
  "otp",
  "token",
  "accesstoken",
  "refreshtoken",
  "secret",
  "cardnumber",
  "cvv",
  "ssn",
  "authorization",
];

const redactObject = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(redactObject);
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      redacted[key] = redactObject(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
};

class Logger {
  private isDevelopment = true;

  public debug(message: string, context?: unknown): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context ? redactObject(context) : "");
    }
  }

  public info(message: string, context?: unknown): void {
    console.info(`[INFO] ${message}`, context ? redactObject(context) : "");
  }

  public warn(message: string, context?: unknown): void {
    console.warn(`[WARN] ${message}`, context ? redactObject(context) : "");
  }

  public error(message: string, error?: unknown, context?: unknown): void {
    console.error(`[ERROR] ${message}`, error, context ? redactObject(context) : "");
  }
}

export const logger = new Logger();
