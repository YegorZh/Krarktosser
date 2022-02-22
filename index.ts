import {CoinTosser, side} from "./offload/coin";
// console.log(CoinTosser.toss(100));
console.log(CoinTosser.tossSequence(100,{priority: side.tails, amountOfTriggers: 1, isSpreadEven: true, maxSecondary: 30, maxPriority: 20}));