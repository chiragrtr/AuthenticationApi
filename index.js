const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./bin/jwt');
const errorHandler = require('./bin/errorHandler');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use(jwt());
app.use('/', require('./users/users.controller'));

app.use(errorHandler);

const port = process.env.PORT || 8989;
const server = app.listen(port, function(){
    console.log('Server is listening on port ' + port);
});