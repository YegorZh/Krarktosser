const express = require('express');
import {Express} from 'express';
const apiRouter = require('./router/api').router;
const app: Express = express();

app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('<p>Welcome to the home page.</p>' +
        '<p>Visit <a href="/about">about<a/> page to get some info on how the api works or go straight to the <a href="/api/coin">api page</a>.</p>');
});

app.get('/about', (req, res) =>{
    res.send('<h1>How does this api work?</h1>'
    +'<p>The main purpose of this api is to toss coins and give you results. But it\'s made to work with complex toss patterns that card Krark\'s Thumb from Magic: ' +
        ' The Gathering creates.</p>' +
        '<h2>Query parameters:</h2>' +
        '<p><b>amount</b> - dictates how many coins to throw. If you just want to throw some coins that\'s the only parameter you need. Number >= 0</p>' +
        '<p><b>krarkAmount</b> - how many "Krark\'s Thumb" you have in play. Each of them dictates exponentially how many coins to throw and interacts with params listed lower. Number >= 0.</p>' +
        '<p>All of the parameters listed below only take effect if krarkAmount is bigger than 0.</p>' +
        '<p><b>side</b> - which side to prioritize with "Krark\'s Thumb". Heads or tails.</p>' +
        '<p><b>minPrio</b> - minimum value to try and achieve for prioritized side. Number >= 0.</p>' +
        '<p><b>maxPrio</b> - maximum value for prioritized side. Once achieved tries to maximize secondary side. Number >= 0.</p>' +
        '<p><b>minSecondary</b> - minimum value to try and achieve for secondary side. Number >= 0.</p>' +
        '<p><b>maxSecondary</b> - maximum value for secondary side. Once achieved maximizes prio or goes for even spread. Number >= 0.</p>' +
        '<p><b>evenSpread</b> - Whether to start spreading heads|tails values or maximize prio side. Bool.</p>' +
        '<p>All params besides amount are optional and will be equal to 0 || false in case they are omitted.</p>')
});

app.all('*', (req, res) => {
    res.send('<p>Error 404. Resource not found. Go to the <a href="/">home page.</a></p>');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Listening on port 8000');
});