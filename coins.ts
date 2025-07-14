import { Coin } from "@keplr-wallet/unit";

export interface StrCoin
{
    denom: string;
    amount: string;
}

export function fromStrCoins(...coins: StrCoin[]): Coin[]
{
    return accumulateAndSort(...coins.map(coin => new Coin(coin.denom, coin.amount)));
}

export function toStrCoin(...coins: Coin[]): StrCoin[]
{
    return accumulateAndSort(...coins).map(c => {
        return {
            denom: c.denom,
            amount: c.amount.toString(),
        }
    })
}

export function accumulateAndSort(...coins: Coin[]): Coin[]
{
    coins = coins.sort((a, b) => a.denom == b.denom ? 0 : a.denom < b.denom ? -1 : 1);
    const coinMap = new Map<string, Coin>();
    for (const coin of coins) {
        const existingCoin = coinMap.get(coin.denom);
        if (existingCoin) {
            coinMap.set(coin.denom, new Coin(coin.denom, existingCoin.amount.add(coin.amount)));
        } else {
            coinMap.set(coin.denom, coin);
        }
    }
    return coins.reduce((acc, coin) => {
        // items are sorted, so duplicate denoms should be next to each other
        if (acc.length > 0 && acc[acc.length - 1].denom == coin.denom) {
            acc[acc.length - 1] = new Coin(coin.denom, acc[acc.length - 1].amount.add(coin.amount));
            return acc;
        }
        acc.push(coin);
        return acc;
    }, []).filter(coin => !coin.amount.isZero());
}

export function add(coins1: Coin[], coins2: Coin[]): Coin[]
{
    return accumulateAndSort(...coins1, ...coins2);
}

export function subtract(coins1: Coin[], coins2: Coin[]): Coin[]
{
    return accumulateAndSort(...add(coins1, negate(coins2)));
}

export function negate(coins: Coin[]): Coin[]
{
    return coins.map(coin => new Coin(coin.denom, coin.amount.neg()))
}

export function hasNegative(coins: Coin[]): boolean
{
    return coins.find(c => c.amount.isNegative()) !== null;
}

export function stringify(...coins: Coin[] | StrCoin[]): string
{
    if (coins.length == 0) {
        return "";
    }
    if (typeof (coins[0].amount) == "string") {
        coins = fromStrCoins(...coins as StrCoin[]);
    }
    return accumulateAndSort(...(coins as Coin[])).map(c => c.amount.toString() + c.denom).join(",");
}
