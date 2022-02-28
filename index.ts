const express = require('express');
import {Express} from 'express';
const apiRouter = require('./router/api').router;
const app: Express = express();

app.use('/api', apiRouter);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://krarktosser.herokuapp.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.static('./assets'))

app.get('/about', (req, res, next) =>{
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
        '<p>All params besides amount are optional and will be equal to 0 || false in case they are omitted.</p>' +
        '<p><a href="/">Home</a> <a href="/api/coin">API</a></p>')
});

app.all('*', (req, res, next) => {
    res.send('<p>Error 404. Resource not found. Go to the <a href="/">home page.</a></p>');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Listening on port 8000');
});