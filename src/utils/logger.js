const canLogDebug = process.env.NODE_ENV !== "production";

const write = (level, message, context = {}) => {
  if (level === "debug" && !canLogDebug) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  const method = level === "error" ? "error" : level === "warn" ? "warn" : "log";
  console[method](entry);
};

const logger = {
  debug: (message, context) => write("debug", message, context),
  info: (message, context) => write("info", message, context),
  warn: (message, context) => write("warn", message, context),
  error: (message, context) => write("error", message, context),
};

export default logger;
