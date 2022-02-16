interface ThumbParameters {
    priority: side;
    amountOfTriggers?: number;
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

    static checkPriority(output: number[], secondary: side, parameters: ThumbParameters) {
        let out: side | undefined;
        if (parameters.isSpreadEven && output[parameters.priority] > output[secondary]) out = secondary;
        if (parameters.maxPriority && output[parameters.priority] >= parameters.maxPriority) if(!(parameters.maxSecondary && output[secondary] >= parameters.maxSecondary)) out = secondary;
        if (parameters.maxSecondary && output[secondary] >= parameters.maxSecondary) if (!(parameters.maxPriority && output[parameters.priority] >= parameters.maxPriority)) out = parameters.priority;
        if (parameters.minSecondary && output[secondary] < parameters.minSecondary) out = secondary;
        if (parameters.minPriority && output[parameters.priority] < parameters.minPriority) out = parameters.priority;
        if(typeof out === 'undefined') out = parameters.priority;

        return out;
    }

    static tossSequence(tossAmount: number = 1, parameters: ThumbParameters = {priority: side.heads}) {
        let output: number[] = [0, 0];

        let iterations = 1;
        if (parameters.amountOfTriggers) iterations = parameters.amountOfTriggers + 1;

        let currentPriority = parameters.priority;
        let secondary: side;
        parameters.priority === side.heads ? secondary = side.tails : secondary = side.heads;

        for (let i = 0; i < tossAmount; i++) {
            currentPriority = this.checkPriority(output, secondary, parameters);
            for (let j = 0; j < iterations; j++) {
                let result = CoinTosser.toss();
                if (iterations - j !== 1 && result !== currentPriority) continue;
                if (result === side.heads) {
                    output[side.heads]++;
                    break;
                } else {
                    output[side.tails]++;
                    break;
                }
            }
        }

        return output;
    }
}