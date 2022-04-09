export interface ThumbParameters {
    priority?: side;
    flipUntilLose?: side;
    coinsPerFlip?: number;
    amountOfThumbs?: number;
    minPriority?: number;
    maxPriority?: number;
    minSecondary?: number;
    maxSecondary?: number;
    isSpreadEven?: boolean;
}

export enum side {
    heads, tails
}

export class CoinTosser {
    static toss() {
        return Math.floor(Math.random() * 2);
    }
    static inverseSide = (inputSide: side | undefined) => inputSide === side.heads ? side.tails : side.heads;

    static checkPriority(output: number[], secondary: side, parameters: ThumbParameters) {
        let out: side | undefined;

        if (parameters.isSpreadEven && output[side.heads] > output[side.tails]) out = side.tails;
        else if (parameters.isSpreadEven && output[side.heads] < output[side.tails]) out = side.heads;

        if (typeof parameters.priority !== 'undefined') {
            let maxSecCheck = Boolean(parameters.maxSecondary && output[secondary] >= parameters.maxSecondary);
            let maxPrioCheck = Boolean(parameters.maxPriority && output[parameters.priority] >= parameters.maxPriority);
            let minSecCheck = Boolean(parameters.minSecondary && output[secondary] < parameters.minSecondary);
            let minPrioCheck = Boolean(parameters.minPriority && output[parameters.priority] < parameters.minPriority);

            if (minSecCheck && !(maxSecCheck)) out = secondary;
            if (minPrioCheck && !(maxPrioCheck)) out = parameters.priority;

            if (!(maxSecCheck && maxPrioCheck)) {
                if (maxPrioCheck) out = secondary;
                if (maxSecCheck) out = parameters.priority;
            }

            if (typeof out === 'undefined') out = parameters.priority;
        }
        return out;
    }

    static async tossSequence(tossAmount: number = 1, parameters: ThumbParameters = {}) {
        let output: number[] = [0, 0];

        let iterations = 1;
        if (parameters.amountOfThumbs) iterations = Math.pow(2, parameters.amountOfThumbs);
        else if (parameters.coinsPerFlip) iterations = parameters.coinsPerFlip;

        let currentPriority = parameters.priority;
        let secondary = CoinTosser.inverseSide(parameters.priority);

        let checkFlipUntilLose = () => false;
        if (
            parameters.flipUntilLose === side.heads ||
            parameters.flipUntilLose === side.tails
        ) checkFlipUntilLose = () => output[CoinTosser.inverseSide(parameters.flipUntilLose as side)] > 0;

        function recursiveLoop(targetI: number, res: Function, i: number = 0) {
            if (i >= targetI || checkFlipUntilLose()) {
                let [heads, tails] = output;
                const totalFlips = (heads + tails) * iterations;
                return res({ heads, tails, totalFlips });
            }
            currentPriority = CoinTosser.checkPriority(output, secondary, parameters);
            for (let j = 0; j < iterations; j++) {
                let result = CoinTosser.toss();
                if (currentPriority !== undefined && iterations - j !== 1 && result !== currentPriority) continue;
                if (result === side.heads) {
                    output[side.heads]++;
                    break;
                } else {
                    output[side.tails]++;
                    break;
                }
            }
            setImmediate(recursiveLoop.bind(null, tossAmount, res, ++i));
        }

        return new Promise((res, rej) => recursiveLoop(tossAmount, res));
    }
}