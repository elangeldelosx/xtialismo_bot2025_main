const { errorLog, warningLog, infoLog } = require("./logger");
const path = require("node:path");
const fs = require("node:fs");

class BadMacHandler {
  constructor() {
    this.errorCount = 0;
    this.maxRetries = 5;
    this.resetInterval = 300000;
    this.lastReset = Date.now();
  }

  isBadMacError(error) {
    const errorMessage = error?.message || error?.toString() || "";
    return (
      errorMessage.includes("Bad MAC") ||
      errorMessage.includes("MAC verification failed") ||
      errorMessage.includes("decryption failed")
    );
  }

  isSessionError(error) {
    const errorMessage = error?.message || error?.toString() || "";
    return (
      errorMessage.includes("Session") ||
      errorMessage.includes("signal protocol") ||
      errorMessage.includes("decrypt") ||
      this.isBadMacError(error)
    );
  }

  clearProblematicSessionFiles() {
    try {
      const baileysFolder = path.resolve(
        process.cwd(),
        "assets",
        "auth",
        "baileys"
      );

      if (!fs.existsSync(baileysFolder)) {
        return false;
      }

      const files = fs.readdirSync(baileysFolder);
      let removedCount = 0;

      for (const file of files) {
        const filePath = path.join(baileysFolder, file);
        if (fs.statSync(filePath).isFile()) {
          if (
            file.includes("app-state-sync-key") ||
            file === "creds.json" ||
            file.includes("app-state-sync-version")
          ) {
            continue;
          }

          if (
            file.includes("pre-key") ||
            file.includes("sender-key") ||
            file.includes("session-") ||
            file.includes("signal-identity")
          ) {
            fs.unlinkSync(filePath);
            infoLog(`Archivo de sesión problemático eliminado: ${file}`);
            removedCount++;
          }
        }
      }

      if (removedCount > 0) {
        warningLog(
          `${removedCount} archivos de sesión problemáticos eliminados. Credenciales principales preservadas.`
        );
        return true;
      }

      return false;
    } catch (error) {
      errorLog(`Error al limpiar archivos de sesión: ${error.message}`);
      return false;
    }
  }

  incrementErrorCount() {
    this.errorCount++;
    errorLog(`Conteo de errores Bad MAC: ${this.errorCount}/${this.maxRetries}`);

    const now = Date.now();
    if (now - this.lastReset > this.resetInterval) {
      this.resetErrorCount();
    }
  }

  resetErrorCount() {
    const previousCount = this.errorCount;
    this.errorCount = 0;
    this.lastReset = Date.now();

    if (previousCount > 0) {
      warningLog(
        `Contador de errores Bad MAC reiniciado. Contador anterior: ${previousCount}`
      );
    }
  }

  hasReachedLimit() {
    return this.errorCount >= this.maxRetries;
  }

  handleError(error, context = "unknown") {
    if (!this.isBadMacError(error)) {
      return false;
    }

    errorLog(`Error Bad MAC detectado en ${context}: ${error.message}`);
    this.incrementErrorCount();

    if (this.hasReachedLimit()) {
      warningLog(
        `Límite de errores Bad MAC alcanzado (${this.maxRetries}). Considere reiniciar el bot.`
      );
      return true;
    }

    warningLog(
      `Ignorando error Bad MAC y continuando operación... (${this.errorCount}/${this.maxRetries})`
    );
    return true;
  }

  createSafeWrapper(fn, context) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        if (this.handleError(error, context)) {
          return null;
        }
        throw error;
      }
    };
  }

  getStats() {
    return {
      errorCount: this.errorCount,
      maxRetries: this.maxRetries,
      lastReset: new Date(this.lastReset).toISOString(),
      timeUntilReset: Math.max(
        0,
        this.resetInterval - (Date.now() - this.lastReset)
      ),
    };
  }
}

const badMacHandler = new BadMacHandler();

module.exports = {
  BadMacHandler,
  badMacHandler,
};
