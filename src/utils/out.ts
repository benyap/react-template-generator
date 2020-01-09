import chalk from "chalk";

/**
 * This class provides methods for logging messages to the output.
 */
class Output {
  private static prefix = chalk.reset("[ReactGen] ");

  private static level = {
    debug: chalk.dim("[DEBUG] "),
    info: chalk.blue("[INFO] "),
    warning: chalk.red("[WARN] "),
    error: chalk.red.bgBlackBright("[ERROR] ")
  };

  public debug(message: any) {
    console.log(Output.prefix + Output.level.debug + chalk.dim(message));
  }

  public info(message: any) {
    console.log(Output.prefix + Output.level.info + chalk.reset(message));
  }

  public warning(message: any) {
    console.log(Output.prefix + Output.level.warning + chalk.reset(message));
  }

  public error(message: any) {
    console.log(Output.prefix + Output.level.error + chalk.red(message));
  }
}

export const out = new Output();
