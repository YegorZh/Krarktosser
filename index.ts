import {CoinTosser, side} from "./coin";
import {fork} from 'child_process';
// console.log(CoinTosser.toss(100));
CoinTosser.tossSequence(100,{priority: side.tails, amountOfTriggers: 1, isSpreadEven: true, maxSecondary: 30, maxPriority: 20})
    .then(value => console.log(value));
console.log('hi');