const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;

const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;

const PORT = '3000';

const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
const isPasswordValid = (password) => password.length >= 6;
const isValidToken = (token) => token.length === 16;
const isValidName = (name) => name >= 3;
const isValidAge = (age) => age >= 18;
const isValidWatchedAt = (watchedAt) => Date.parse(watchedAt);
const isValidRate = (rate) => rate >= 1 && rate >= 5;

const TALKER_NOT_FOUND_MSG = {
  message: 'Pessoa palestrante não encontrada',
};

const INVALID_TOKEN_MSG = {
  message: 'Token inválido',
};

const TOKEN_NOT_FOUND = {
  message: 'Token não encontrado',
};

const NO_NAME_MSG = {
  message: 'O campo "name" é obrigatório',
};

const INVALID_NAME_MSG = {
  message: 'O "name" deve ter pelo menos 3 caracteres',
};

const NO_AGE_MSG = {
  message: 'O campo "age" é obrigatório',
};

const INVALID_AGE_MSG = {
  message: 'A pessoa palestrante deve ser maior de idade',
};

const NO_TALK_MSG = {
  message: 'O campo "talk" é obrigatório',
};

const NO_WATCHED_AT_MSG = {
  message: 'O campo "watchedAt" é obrigatório',
};

const INVALID_WATCHED_AT_MSG = {
  message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
};

const NO_RATE_MSG = {
  message: 'O campo "rate" é obrigatório',
};

const INVALID_RATE_MSG = {
  message: 'O campo "rate" deve ser um inteiro de 1 à 5',
};

const NO_EMAIL_MSG = {
  message: 'O campo "email" é obrigatório',
};
const INVALID_EMAIL_MSG = {
  message: 'O "email" deve ter o formato "email@email.com"',
};
const NO_PASSWORD_MSG = {
  message: 'O campo "password" é obrigatório',
};
const INVALID_PASSWORD_MSG = {
  message: 'O "password" deve ter pelo menos 6 caracteres',
};

const validateLogin = (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;
  if (!email) return res.status(HTTP_BAD_REQUEST).json(NO_EMAIL_MSG);

  if (!isEmailValid(email)) return res.status(HTTP_BAD_REQUEST).json(INVALID_EMAIL_MSG);
  
  if (!password) res.status(HTTP_BAD_REQUEST).json(NO_PASSWORD_MSG);

  if (!isPasswordValid(password)) res.status(HTTP_BAD_REQUEST).json(INVALID_PASSWORD_MSG);
  
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

  return res.status(HTTP_NOT_FOUND).json(TALKER_NOT_FOUND_MSG);
});

app.post('/login', validateLogin, (req, res) => {
  const randomToken = (generateRandomToken() + generateRandomToken()).substring(1, 17);
  res.status(HTTP_OK_STATUS).json({
    token: randomToken,
  });
});

app.post('/talker', (req, res) => {
  const { authorization } = req.headers;
  const { name, age, talk } = req.body;
  
  if (!authorization) return res.status(HTTP_UNAUTHORIZED).json(TOKEN_NOT_FOUND);
  if (!isValidToken(authorization)) return res.status(HTTP_UNAUTHORIZED).json(INVALID_TOKEN_MSG);

  if (!age) return res.status(HTTP_BAD_REQUEST).json(NO_AGE_MSG);
  if (!isValidAge(age)) return res.status(HTTP_BAD_REQUEST).json(INVALID_AGE_MSG);

  if (!talk) return res.status(HTTP_BAD_REQUEST).json(NO_TALK_MSG);

  //
  if (!talk.watchedAt) return res.status(HTTP_BAD_REQUEST).json(NO_WATCHED_AT_MSG);

  if (!talk.rate) return res.status(HTTP_BAD_REQUEST).json(NO_RATE_MSG);
  if (!isValidRate(talk.rate)) return res.status(HTTP_BAD_REQUEST).json(INVALID_RATE_MSG);

  if (!name) return res.status(HTTP_BAD_REQUEST).json(NO_NAME_MSG);
  if (!isValidName(name)) return res.status(HTTP_BAD_REQUEST).json(INVALID_NAME_MSG);
});