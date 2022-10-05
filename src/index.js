const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const {
  validateLogin,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
} = require('./authentication');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED = 201;
const HTTP_NO_CONTENT = 204;

const HTTP_NOT_FOUND = 404;

const PORT = '3000';

const TALKER_NOT_FOUND_MSG = {
  message: 'Pessoa palestrante não encontrada',
};

const pathTalkers = path.resolve(
  __dirname,
  '.',
  'talker.json',
);

const getTalkers = async () => {
  const talkers = JSON.parse(await fs.readFile(pathTalkers, 'utf-8'));
  return talkers;
};

// Part of the solution can be found at:
// https://thewebdev.info/2021/10/13/how-to-create-a-random-token-in-javascript/
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

app.post('/talker',
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
  async (req, res) => {
    let id = 5;

    const newTalker = { ...req.body, id };
    const talkers = await getTalkers();
    talkers.push(newTalker);
    await fs.writeFile(pathTalkers, JSON.stringify(talkers));
    res.status(HTTP_CREATED).json(newTalker);

    id += 1;
});

app.put('/talker/:id',
validateToken,
validateName,
validateAge,
validateTalk,
validateTalkWatchedAt,
validateTalkRate,
async (req, res) => {
  const { id } = req.params;
  const numberId = Number(id);

  const talkers = await getTalkers();
  const selectedTalker = talkers
    .find((talker) => talker.id === numberId);
  const selectedTalkerIndex = talkers.indexOf(selectedTalker);

  const updatedTalker = { ...req.body, id: numberId };
  talkers.splice(selectedTalkerIndex, 1, updatedTalker);

  await fs.writeFile(pathTalkers, JSON.stringify(talkers));
  res.status(HTTP_OK_STATUS).json(updatedTalker);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const talkers = await getTalkers();
  const selectedTalker = talkers
    .find((talker) => talker.id === Number(id));
  const selectedTalkerIndex = talkers.indexOf(selectedTalker);
  talkers.splice(selectedTalkerIndex, 1);

  await fs.writeFile(pathTalkers, JSON.stringify(talkers));

  res.status(HTTP_NO_CONTENT).json();
});