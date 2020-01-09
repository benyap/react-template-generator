import chalk from "chalk";

/**
 * This class provides methods for logging messages to the output.
 */
class Output {
  private static prefix = chalk.reset("[ReactTSGen] ");

  private static level = {
    debug: chalk.dim("[DEBUG] "),
    info: chalk.blue("[INFO] "),
    warning: chalk.red("[WARN] "),
    error: chalk.red.bgBlackBright("[ERROR] ")
  };

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
      logMethod(Output.prefix + level + message);
    } else {
      // Otherwise, stringify the message and log each line.
      const lines = JSON.stringify(message, null, 2).split("\n");
      lines.forEach((line, index) => {
        if (index === 0) logMethod(Output.prefix + level + line);
        else {
          let spacer = "      ";
          if (/\[[A-Z]{5}\]/g.test(level)) spacer = "       ";
          logMethod(Output.prefix + spacer + line);
        }
      });
    }
  }
}

export const out = new Output();
