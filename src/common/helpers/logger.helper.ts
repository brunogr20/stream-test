import * as dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const newrelicFormatter = require('@newrelic/winston-enricher');
import * as winston from 'winston';

dotenv.config();

class LoggerConfig {
  private logConsoleOptions: winston.transports.ConsoleTransportOptions;
  private logNewRealicOptions: winston.transports.ConsoleTransportOptions;
  public logger: winston.Logger;

  constructor() {
    this.logConsoleOptions = this.configureLogConsoleOptions();
    this.logNewRealicOptions = this.configureLogNewRealicOptions();
    this.initialize();
  }

  public initialize(): void {
    const transports = [
      new winston.transports.Console(this.logConsoleOptions),
    ];

    // transports.push(new winston.transports.Console(this.logNewRealicOptions));


    this.logger = winston.createLogger({
      transports: transports,
      exitOnError: false,
    });

    this.logger.stream({
      write: function (message: unknown): void {
        this.logger.info(message);
      },
    });
  }

  private configureLogConsoleOptions(): winston.transports.ConsoleTransportOptions {
    const colorizer = winston.format.colorize();

    return {
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf((msg) =>
          colorizer.colorize(
            msg.level,
            `[${msg.level}][${msg.timestamp}] ${msg.message}`,
          ),
        ),
      ),
    };
  }

  private configureLogNewRealicOptions(): winston.transports.ConsoleTransportOptions {
    const newrelicWinstonFormatter = newrelicFormatter(winston);

    return {
      level: 'info',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        newrelicWinstonFormatter(),
      ),
    };
  }
}

export default new LoggerConfig().logger;
