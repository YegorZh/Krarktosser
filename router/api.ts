import {Router} from "express";
import {CoinTosser, side, ThumbParameters} from "../coin";
const express = require('express');
export const router: Router = express.Router();

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

router.get('/coin', (req, res, next) =>{
    const regex = new RegExp('^\\d+$');
    function testQuery(query: any) {
        return (typeof query === 'string' && regex.test(query));
    }

    let n: number;
    if(!req.query.amount) n = 1;
    else if (!testQuery(req.query.amount)) return res.status(400).send('Bad request, amount query has invalid value. Use a number.');
    else n = Number(req.query.amount);

    let params: ThumbParameters = {};
    if(req.query.side){
        if (req.query.side === 'heads' || req.query.side === 'head' || req.query.side === 'h' || req.query.side === '0') params.priority = side.heads;
        else if (req.query.side === 'tails' || req.query.side === 'tail' || req.query.side === 't' || req.query.side === '1') params.priority = side.tails;
        else return res.status(400).send('Invalid value for side query. Use heads or tails');
    }
    console.log(params.priority);
    
    if (testQuery(req.query.krarkAmount)) params.amountOfThumbs = Number(req.query.krarkAmount);
    if (testQuery(req.query.minPrio)) params.minPriority = Number(req.query.minPrio);
    if (testQuery(req.query.maxPrio)) params.maxPriority = Number(req.query.maxPrio);
    if (testQuery(req.query.minSecond)) params.minSecondary = Number(req.query.minSecond);
    if (testQuery(req.query.maxSecond)) params.maxSecondary = Number(req.query.maxSecond);
    if (typeof req.query.evenSpread === 'string' && req.query.evenSpread === 'true') params.isSpreadEven = true;

    CoinTosser.tossSequence(n, params).then(value => {
        return res.json(value);
    })
})