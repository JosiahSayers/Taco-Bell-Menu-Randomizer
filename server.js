const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const randomRouter = require('./controllers/random');
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/random', randomRouter);

app.get('/', (req, res) => {
  res.render('/public/index.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))