const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const validUser = {
  email: 'email@email.com',
  password: '123456',
};

const validateLogin = async (req, res, next) => {
  if (req.body === validUser) {
    next();
  }
};

// Part of the solution can be found here
// : https://thewebdev.info/2021/10/13/how-to-create-a-random-token-in-javascript/
const generateRandomToken = () => Math.random().toString(36).substring(2);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const pathTalkers = path.resolve(
    __dirname,
    '.',
    'talker.json',
  );

  const talkers = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
  res.status(HTTP_OK_STATUS).json(talkers);
});

app.post('/login', (req, res) => {
  const randomToken = (generateRandomToken() + generateRandomToken()).substring(1, 17);
  res.status(HTTP_OK_STATUS).json({
    token: randomToken,
  });
});
