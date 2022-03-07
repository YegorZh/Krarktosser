export interface ThumbParameters {
    priority?: side;
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

    static checkPriority(output: number[], secondary: side, parameters: ThumbParameters) {
        let out: side | undefined;
        
        if(parameters.isSpreadEven && output[side.heads] > output[side.tails]) out = side.tails;
        else if(parameters.isSpreadEven && output[side.heads] < output[side.tails]) out = side.heads;

        if (typeof parameters.priority !== 'undefined') {
            let maxSecCheck = Boolean(parameters.maxSecondary && output[secondary] >= parameters.maxSecondary);
            let maxPrioCheck = Boolean(parameters.maxPriority && output[parameters.priority] >= parameters.maxPriority);
            let minSecCheck = Boolean(parameters.minSecondary && output[secondary] < parameters.minSecondary);
            let minPrioCheck = Boolean(parameters.minPriority && output[parameters.priority] < parameters.minPriority);

            if(minSecCheck && !(parameters.maxSecondary || maxSecCheck)) out = secondary;
            if(minPrioCheck && !(parameters.maxPriority || maxPrioCheck)) out = parameters.priority;
            
            if(!(maxSecCheck && maxPrioCheck)){
                if(maxPrioCheck) out = secondary;
                if(maxSecCheck) out = parameters.priority;
            }

            if(typeof out === 'undefined') out = parameters.priority;   
        }
        return out;
    }

    static async tossSequence(tossAmount: number = 1, parameters: ThumbParameters = {}) {
        let output: number[] = [0, 0];

        let iterations = 1;
        if (parameters.amountOfThumbs) iterations = Math.pow(2, parameters.amountOfThumbs);

        let currentPriority = parameters.priority;
        let secondary: side;
        parameters.priority === side.heads ? secondary = side.tails : secondary = side.heads;

        function recursiveLoop(targetI: number, res: Function, i: number = 0){
            if(i >= targetI) {
                let [heads, tails] = output;
                const totalFlips = tossAmount * iterations;
                return res({heads, tails, totalFlips});
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