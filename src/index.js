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

const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
const isPasswordValid = (password) => password.length >= 6;

const validateLogin = async (req, res, next) => {
  if ('email' in req === '' || 'email' in req === undefined) {
    return res.status(400).json('oi');
  }
  if (!isEmailValid('email' in req)) {
    return res.status(400).json('Invalid email');
  }
  if (!isPasswordValid('password' in req)) {
    return res.status(400).json('Invalid password');
  }

  next();
};

const getTalkers = async () => {
  const pathTalkers = path.resolve(
    __dirname,
    '.',
    'talker.json',
  );

  const talkers = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
  return talkers;
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
  const talkers = await getTalkers();
  res.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalkers();
  const selectedTalker = talkers
    .find((talker) => talker.id === Number(id));
  if (selectedTalker) {
    return res.status(HTTP_OK_STATUS).json(selectedTalker);
  }

  return res.status(404).json({
    message: 'Pessoa palestrante não encontrada',
  });
});

app.post('/login', validateLogin, (req, res) => {
  const randomToken = (generateRandomToken() + generateRandomToken()).substring(1, 17);
  res.status(HTTP_OK_STATUS).json({
    token: randomToken,
  });
});
