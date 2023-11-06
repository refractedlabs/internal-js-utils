import {createLogger, format, Logger, transports} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { JsonClassType, JsonProperty } from "jackson-js";

export class LogConfiguration {
    @JsonProperty()
    @JsonClassType({ type: () => [String] })
    level: string;
    @JsonProperty()
    @JsonClassType({ type: () => [String] })
    dirname: string;
    @JsonProperty()
    @JsonClassType({ type: () => [String] })
    filename: string;
    @JsonProperty()
    @JsonClassType({ type: () => [String] })
    maxSize: string;
    @JsonProperty()
    @JsonClassType({ type: () => [Number] })
    maxFiles: number;


    constructor(level: string, dirname: string, filename: string, maxSize: string, maxFiles: number) {
        this.level = level;
        this.dirname = dirname;
        this.filename = filename;
        this.maxSize = maxSize;
        this.maxFiles = maxFiles;
    }
}

let logConfig = new LogConfiguration('info','logs','app.log','1mb',10)

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



