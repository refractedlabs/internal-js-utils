import { exit } from "process";
import {loadConfig, saveConfigAsEnv} from "./config";

async function main() {
    const args = process.argv
    if (args.length != 4) {
        console.log(`usage: ${args[1]} config.yaml config.env`)
        exit(-1)
    }
    const config = await loadConfig(args[2])
    await saveConfigAsEnv(config, args[3], true)
}

main().catch(console.error)