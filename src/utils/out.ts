import chalk from "chalk";

/**
 * Provides methods for logging decorated messages
 * to the output. Each log message is prefixed with
 * a name and the severity of the log message.
 */
class Output {
  private static level = {
    debug: chalk.dim("[DEBUG]") + " ",
    info: chalk.blue("[INFO]") + "  ",
    warning: chalk.red("[WARN]") + "  ",
    error: chalk.red.bgBlackBright("[ERROR]") + " "
  };

  private prefix: string;

  constructor(name: string) {
    this.prefix = chalk.reset(`[${name}]`) + " ";
  }

  public debug(message: any) {
    this.log(Output.level.debug, message);
  }

  public info(message: any) {
    this.log(Output.level.info, message);
  }

  public warning(message: any) {
    this.log(Output.level.warning, message);
  }

  public error(message: any) {
    this.log(Output.level.error, message, console.error);
  }

  private log(
    level: string,
    message: any,
    logMethod: (...any: any[]) => void = console.log
  ) {
    if (typeof message === "string") {
      // If the message is a string, just log it
      logMethod(this.prefix + level + message);
    } else {
      // Otherwise, stringify the message and log each line.
      const lines = JSON.stringify(message, null, 2).split("\n");
      lines.forEach((line, index) => {
        if (index === 0) logMethod(this.prefix + level + line);
        else logMethod(this.prefix + "        " + line);
      });
    }
  }
}

export const out = new Output("ReactGen");
