// Part of the solution can be found at:
// https://stackoverflow.com/questions/10194464/javascript-dd-mm-yyyy-date-check

const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;

const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
const isPasswordValid = (password) => password.length >= 6;
const isValidToken = (token) => token.length === 16;
const isValidName = (name) => name.length >= 3;
const isValidAge = (age) => age >= 18;
const isValidWatchedAt = (input) => {
  const reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
  return !!input.match(reg);
};
const isValidRate = (rate) => rate > 1 && rate <= 5;

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
  
  if (!password) return res.status(HTTP_BAD_REQUEST).json(NO_PASSWORD_MSG);

  if (!isPasswordValid(password)) return res.status(HTTP_BAD_REQUEST).json(INVALID_PASSWORD_MSG);
  
  next();
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(HTTP_UNAUTHORIZED).json(TOKEN_NOT_FOUND);
  if (!isValidToken(authorization)) return res.status(HTTP_UNAUTHORIZED).json(INVALID_TOKEN_MSG);

  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name) return res.status(HTTP_BAD_REQUEST).json(NO_NAME_MSG);
  if (!isValidName(name)) return res.status(HTTP_BAD_REQUEST).json(INVALID_NAME_MSG);

  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) return res.status(HTTP_BAD_REQUEST).json(NO_AGE_MSG);
  if (!isValidAge(age)) return res.status(HTTP_BAD_REQUEST).json(INVALID_AGE_MSG);

  next();
};

const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(HTTP_BAD_REQUEST).json(NO_TALK_MSG);

  next();
};

const validateTalkWatchedAt = (req, res, next) => {
  const { talk } = req.body;

  if (!talk.watchedAt) return res.status(HTTP_BAD_REQUEST).json(NO_WATCHED_AT_MSG);
  if (!isValidWatchedAt(talk.watchedAt)) {
    return res.status(HTTP_BAD_REQUEST)
    .json(INVALID_WATCHED_AT_MSG);
  }

  next();
};

const validateTalkRate = (req, res, next) => {
  const { talk } = req.body;

  if (talk.rate === '' || talk.rate === undefined) {
    return res
      .status(HTTP_BAD_REQUEST).json(NO_RATE_MSG); 
}
  if (!isValidRate(talk.rate)) return res.status(HTTP_BAD_REQUEST).json(INVALID_RATE_MSG);

  next();
};

module.exports = {
  validateLogin,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateTalkWatchedAt,
  validateTalkRate,
};