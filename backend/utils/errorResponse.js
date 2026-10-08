const redactSensitiveText = (value) =>
  String(value)
    .replace(/\b([a-z][a-z0-9+.-]*:\/\/)[^/\s@]+@/gi, "$1[REDACTED]@")
    .replace(
      /\b(authorization|proxy-authorization|cookie|set-cookie)\s*[:=]\s*[^,\r\n]*/gi,
      "$1: [REDACTED]"
    )
    .replace(/\bbearer\s+[^\s,;]+/gi, "Bearer [REDACTED]")
    .replace(
      /["']?\b(password|passwd|pwd|secret|client[_-]?secret|token|access[_-]?token|api[_-]?key)["']?\s*[:=]\s*["']?[^"'\s,;&}]+["']?/gi,
      "$1=[REDACTED]"
    );

const getSafeErrorDetails = (error) => {
  if (error instanceof Error) {
    return {
      name: redactSensitiveText(error.name),
      message: redactSensitiveText(error.message),
      stack: error.stack ? redactSensitiveText(error.stack) : undefined,
    };
  }

  return {
    name: "NonErrorThrown",
    message: redactSensitiveText(error),
  };
};

export const sendInternalError = (res, error, statusCode = 500) => {
  console.error("[SERVER ERROR]", getSafeErrorDetails(error));

  return res.status(statusCode).json({
    success: false,
    message: "Internal server error",
  });
};

export default sendInternalError;
