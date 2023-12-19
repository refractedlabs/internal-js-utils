import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";

export function gasFromString(gasPrice: string) {
    // Use Decimal.fromUserInput and checkDenom for detailed checks and helpful error messages
    const matchResult = gasPrice.match(/^(\d+(?:\.\d+)?|\.\d+)([a-zA-Z][a-zA-Z0-9/:._-]{2,127})$/i);
    if (!matchResult) {
        throw new Error("Invalid gas price string");
    }
    const [_, amount, denom] = matchResult;
    const fractionalDigits = 18;
    const decimalAmount = Decimal.fromUserInput(amount, fractionalDigits);
    return new GasPrice(decimalAmount, denom);
}