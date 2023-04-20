import {createLogger, format, Logger, transports} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export interface LogConfiguration {
    level: string;
    dirname: string;
    filename: string;
    maxSize: string;
    maxFiles: number;
}

let logConfig: LogConfiguration = {
    level: 'info',
    dirname: 'logs',
    filename: 'app.log',
    maxSize: '1mb',
    maxFiles: 10
};

export function getLogConfig(): LogConfiguration {
    return logConfig;
}

export let rootLogger: Logger;
export let commonLogger: Logger;

export function initLogger(c: LogConfiguration): void {
    logConfig = c
    rootLogger = createLogger({
        level: logConfig.level,
        transports: [
            new transports.Console(),
            new DailyRotateFile({
                dirname: logConfig.dirname,
                filename: logConfig.filename,
                maxSize: logConfig.maxSize,
                maxFiles: logConfig.maxFiles
            })
        ],
        format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({timestamp, name, level, message, error}) => {
                if (error == undefined)
                    return `[${timestamp}] ${name} ${level}: ${message}`;
                return `[${timestamp}] ${name} ${level}: ${message} Error: ${JSON.stringify(error)}\nStack: ${error.stack}`;
            })
        )
    }).child({name: "root"});
    commonLogger = rootLogger.child({name: "common"})
}



