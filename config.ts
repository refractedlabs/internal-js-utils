import {load} from "js-yaml";
import {readFile} from "fs/promises";

export async function loadConfig<C>(file: string): Promise<C> {
    const config = load(await readFile(file, "utf8")) as C;
    forceEnv(config)
    return config;
}

function forceEnv(input: any, prefix?: string): void {
    for (const key in input) {
        const newKey = prefix ? `${prefix}_${key}` : key;
        if (typeof input[key] === "object" || Array.isArray(input[key])) {
            forceEnv(input[key], newKey)
        } else {
            input[key] = parseValue(newKey, input[key])
        }
    }
}

function parseValue(key: string, val: any) {
    const envElement = process.env[key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).toUpperCase()];
    if (envElement)
        return typeof val === "number" ? Number(envElement) : envElement
    return val
}