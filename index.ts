import {CoinTosser} from "./coin";

const express = require('express');
import {Express} from 'express';
import {ThumbParameters, side} from "./coin";

const app: Express = express();
app.get('/api/coin', (req, res) => {
    const regex = new RegExp('^\\d+$');
    function testQuery(query: any) {
        return (typeof query === 'string' && regex.test(query));
    }

    let n: number;
    if(!req.query.amount) n = 1;
    else if (!testQuery(req.query.amount)) return res.status(400).send('Bad request, amount query has invalid value. Use a number.');
    else n = Number(req.query.amount);

    let prio = 0;
    if(req.query.side){
        if (req.query.side === 'heads' || req.query.side === 'head' || req.query.side === 'h' || req.query.side === '0') prio = side.heads;
        else if (req.query.side === 'tails' || req.query.side === 'tail' || req.query.side === 't' || req.query.side === '1') prio = side.heads;
        else return res.status(400).send('Invalid value for side query. Use heads or tails');
    }

    let params: ThumbParameters = {
        priority: prio
    };

    if (testQuery(req.query.triggers)) params.amountOfTriggers = Number(req.query.triggers);
    if (testQuery(req.query.minprio)) params.minPriority = Number(req.query.minprio);
    if (testQuery(req.query.maxprio)) params.maxPriority = Number(req.query.maxprio);
    if (testQuery(req.query.minsecond)) params.minSecondary = Number(req.query.minsecond);
    if (testQuery(req.query.maxsecond)) params.maxSecondary = Number(req.query.maxsecond);
    if (typeof req.query.evenspread === 'string' && req.query.evenspread === 'true') params.isSpreadEven = true;

    CoinTosser.tossSequence(n, params).then(value => {
        return res.json(value);
    })
})

app.all('*', (req, res) => {
    res.send('Error 404. Resource not found.');
})

app.listen(8000, () => {
    console.log('Listening on port 8000')
})