const express = require('express');
import {Express} from 'express';
import * as path from 'path';
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
    res.sendFile(path.join(__dirname, 'assets/about.html'));
});

app.all('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'assets/error.html'));
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});