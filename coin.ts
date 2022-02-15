interface ThumbParameters {
    priority: side;
    minPriority?: number;
    maxPriority?: number;
    minSecondary?: number;
    maxSecondary?: number;
}
export enum side {
    heads, tails
}

export class CoinTosser {
    static toss(){
        return Math.floor(Math.random() * 2);
    }
    static usualTossSequence(n: number = 1) {
        let heads = 0;
        let tails = 0;

        for (let i = 0; i < n; i++) {
                if (CoinTosser.toss() === side.heads) {
                    heads++;
                } else {
                    tails++;
            }
        }

        return {heads, tails};
    }
    static thumbMaxValueTossSequence(n: number, priority: side){
       return CoinTosser.thumbTossSequence(n, {priority: priority, minSecondary: 1})
    }


    static thumbTossSequence(n: number = 1, parameters: ThumbParameters) {
        let output: number[] = [0,0];
        let currentPriority = parameters.priority;
        let secondary: side;
        parameters.priority === side.heads ? secondary = side.tails : secondary = side.heads;

        for(let i = 0; i < n; i++){
            if(parameters.minPriority && output[parameters.priority] < parameters.minPriority) currentPriority = parameters.priority;
            else if(parameters.minSecondary && output[secondary] < parameters.minSecondary) currentPriority = secondary;
            else if(parameters.maxPriority && output[parameters.priority] < parameters.maxPriority) currentPriority = parameters.priority;
            else if(parameters.maxSecondary && output[parameters.priority] < parameters.maxSecondary) currentPriority = secondary;
            else currentPriority = parameters.priority;

            for(let j = 0; j < 2; j++){
                let result = CoinTosser.toss();
                if(2 - j !== 1 && result !== currentPriority) continue;
                if(result === side.heads){
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