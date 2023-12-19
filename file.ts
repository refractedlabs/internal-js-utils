import * as fs from "fs"
import * as path from "path"

export interface Replacement {
    regex: RegExp,
    subst: string
}

export function correctFile(file: string, replacements: Replacement[]) {
    let text = (fs.readFileSync(file)).toString()
    for (const p of replacements) {
        text = text.replace(p.regex, p.subst)
    }
    fs.writeFileSync(file, text)
}

export function correctFiles(files: string[], replacements: Replacement[]) {
    for (let f of files) {
        correctFile(f, replacements)
    }
}

export function correctDir(dir: string, replacements: Replacement[], filter?: string) {
    if (!fs.existsSync(dir)) {
        throw new Error(`invalid path ${dir}`)
    }
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(dir, files[i])
        const stat = fs.lstatSync(filename)
        if (stat.isDirectory()) {
            correctDir(filename, replacements, filter)
        } else if (filter === undefined || filename.match(filter)) {
            correctFile(filename, replacements)
        }
    }
}
