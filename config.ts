import {load} from "js-yaml";
import {readFile, writeFile} from "fs/promises";

export async function saveConfigAsEnv(configuration: any, file: string, separateByNewLine: boolean = false) {
    const m = toEnv(configuration, separateByNewLine)
    const data = [...m.entries()].map(e => e[0].startsWith("\n") ? "" : `${e[0]}=${e[1]}`).join("\n")
    await writeFile(file, data, "utf8")
}

export async function loadConfig<C>(file: string): Promise<C> {
    const config = load(await readFile(file, "utf8")) as C;
    updateConfigurationFromEnv(config)
    return config;
}

function updateConfigurationFromEnv(configuration: any, prefix?: string): void {
    for (const key in configuration) {
        const newKey = prefix ? `${prefix}_${key}` : key;
        if (typeof configuration[key] === "object" || Array.isArray(configuration[key])) {
            updateConfigurationFromEnv(configuration[key], newKey)
        } else {
            configuration[key] = parseValue(newKey, configuration[key])
        }
    }
}

function parseValue(key: string, val: any) {
    const envElement = process.env[camelCaseToDashCase(key)];
    if (envElement)
        return typeof val === "number" ? Number(envElement) :
            typeof val === "boolean" ? envElement == "true" : envElement
    return val
}

function toEnv(configuration: any, separateByNewLine: boolean = false): Map<string, string> {
    const m = new Map<string, string>()
    _toEnv(configuration, m, separateByNewLine)
    return m
}

function _toEnv(configuration: any, output: Map<string, string>, separateByNewLine: boolean, prefix?: string) {
    for (const key in configuration) {
        const newKey = prefix ? `${prefix}_${key}` : key;
        if (typeof configuration[key] === "object" || Array.isArray(configuration[key])) {
            _toEnv(configuration[key], output, separateByNewLine, newKey)
        } else {
            output.set(camelCaseToDashCase(newKey), `${configuration[key]}`)
            if (separateByNewLine && prefix == undefined)
                output.set(`\n${output.size}`, "")
        }
    }
    if (separateByNewLine && (prefix && !prefix.includes("_"))) //only separates in one level
        output.set(`\n${output.size}`, "")
}

function camelCaseToDashCase(input: string): string {
    return input.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).toUpperCase()
}