import {CoinTosser, side} from "./coin";
// console.log(CoinTosser.toss(100));
console.log(CoinTosser.usualTossSequence(100));
console.log(CoinTosser.thumbTossSequence(100,{priority: side.heads}));
console.log(CoinTosser.thumbTossSequence(100,{priority: side.tails}));
console.log(CoinTosser.thumbMaxValueTossSequence(100, side.tails));