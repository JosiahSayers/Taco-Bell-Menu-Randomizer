const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const randomRouter = require('./controllers/random');
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/random', randomRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))