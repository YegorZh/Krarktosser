import { Router } from "express"; 
import { CoinTosser, side, ThumbParameters } from "../coin";
const express = require('express');
const verifyOr = (input: string, match: string[]) => {
    let out = false;
    match.forEach(n => {
        if(n === input) out = true;
    });
    return out;
};
export const router: Router = express.Router();
let interactions = 0;
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/coin', (req, res, next) => {
    console.log(++interactions);
    const regex = new RegExp('^\\d+$');
    function testQuery(query: any) {
        return (typeof query === 'string' && regex.test(query));
    }

    let n: number;
    if (!req.query.amount) n = 1;
    else if (!testQuery(req.query.amount)) return res.status(400).send('Bad request, amount query has invalid value. Use a number.');
    else n = Number(req.query.amount);

    let params: ThumbParameters = {};
    if (req.query.side) {
        if (verifyOr(req.query.side as string, ['heads', 'head', 'h', '0'])) params.priority = side.heads;
        else if (verifyOr(req.query.side as string,['tails', 'tail', 't', '1'])) params.priority = side.tails;
        else if (req.query.side !== 'none') return res.status(400).send('Invalid value for side query. Use heads, tails or none.');
    }

    if (req.query.flipUntilLose) {
        if(verifyOr(req.query.flipUntilLose as string, ['heads', 'head', 'h', '0'])) params.flipUntilLose = side.heads;
        else if (verifyOr(req.query.flipUntilLose as string,['tails', 'tail', 't', '1'])) params.flipUntilLose = side.tails;
        else if (req.query.flipUntilLose !== 'off' && req.query.flipUntilLose !== 'false') return res.status(400).send('Invalid value for flipUntilLose query. Use heads, tails or off.');
    }

    if (testQuery(req.query.krarkAmount)) params.amountOfThumbs = Number(req.query.krarkAmount);
    if (testQuery(req.query.coinsPerFlip)) params.coinsPerFlip = Number(req.query.coinsPerFlip);
    if (testQuery(req.query.minPrio)) params.minPriority = Number(req.query.minPrio);
    if (testQuery(req.query.maxPrio)) params.maxPriority = Number(req.query.maxPrio);
    if (testQuery(req.query.minSecond)) params.minSecondary = Number(req.query.minSecond);
    if (testQuery(req.query.maxSecond)) params.maxSecondary = Number(req.query.maxSecond);
    if (typeof req.query.evenSpread === 'string' && (req.query.evenSpread === 'true' || req.query.evenSpread === 'on')) params.isSpreadEven = true;

    CoinTosser.tossSequence(n, params).then(value => {
        return res.json(value);
    })
})
