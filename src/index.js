const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_OK_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const PORT = '3000';

const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
const isPasswordValid = (password) => password.length >= 6;
const NO_EMAIL_MESSAGE = {
  message: 'O campo "email" é obrigatório',
};
const INVALID_EMAIL_MESSAGE = {
  message: 'O "email" deve ter o formato "email@email.com"',
};
const NO_PASSWORD_MESSAGE = {
  message: 'O campo "password" é obrigatório',
};
const INVALID_PASSWORD_MESSAGE = {
  message: 'O "password" deve ter pelo menos 6 caracteres',
};

const validateLogin = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  if (!email) {
    return res.status(HTTP_OK_BAD_REQUEST).json(NO_EMAIL_MESSAGE);
  }

  if (!isEmailValid(email)) {
    return res.status(HTTP_OK_BAD_REQUEST).json(INVALID_EMAIL_MESSAGE);
  }

  if (!password) {
    return res.status(HTTP_OK_BAD_REQUEST).json(NO_PASSWORD_MESSAGE);
  }

  if (!isPasswordValid(password)) {
    return res.status(HTTP_OK_BAD_REQUEST).json(INVALID_PASSWORD_MESSAGE);
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

  return res.status(HTTP_NOT_FOUND).json({
    message: 'Pessoa palestrante não encontrada',
  });
});

app.post('/login', validateLogin, (req, res) => {
  const randomToken = (generateRandomToken() + generateRandomToken()).substring(1, 17);
  res.status(HTTP_OK_STATUS).json({
    token: randomToken,
  });
});
