import { CustomMapper, Deserializer } from "jackson-js/dist/@types";
import { fromBech32 } from "@cosmjs/encoding";

export const numberDeserializer: CustomMapper<Deserializer> = {
    type: () => Number,
    mapper: (key: string, obj: any, context) => {
        const t = typeof obj;
        if (t == "number")
            return obj
        throw new ValidationError(`invalid type for property ${key}: ${t}`)
    }
};

export const booleanDeserializer: CustomMapper<Deserializer> = {
    type: () => Boolean,
    mapper: (key: string, obj: any, context) => {
        const t = typeof obj;
        if (t == "boolean")
            return obj
        throw new ValidationError(`invalid type for property ${key}: ${t}`)
    }
};

export const stringDeserializer: CustomMapper<Deserializer> = {
    type: () => String,
    mapper: (key: string, obj: any, context) => {
        const t = typeof obj;
        if (t == "string") {
            if (key.endsWith("AccAddress")) {
                try {
                    fromBech32(obj)
                } catch (e) {
                    throw new ValidationError(`invalid address for property ${key.replace("AccAddress", "")}: ${t}: ${e}`)
                }
            } else if (key.endsWith("ValAddress")) {
                try {
                    fromBech32(obj)
                } catch (e) {
                    throw new ValidationError(`invalid address for property ${key.replace("ValAddress", "")}: ${t}: ${e}`)
                }
                if (!obj.includes("valoper")){
                    throw new ValidationError(`invalid operator address for property ${key.replace("ValAddress", "")}: ${t}`)
                }
            }
            return obj
        }
        throw new ValidationError(`invalid type for property ${key}: ${t}`)
    }
};

export const defaultDeserializers: CustomMapper<Deserializer>[] = [numberDeserializer, booleanDeserializer, stringDeserializer]

export class ValidationError extends Error {
    constructor(readonly msg: string) {
        super(msg);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}