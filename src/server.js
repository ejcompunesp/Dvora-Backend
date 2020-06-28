const express = require('express');
const cors = require('cors');
const path = require('path');

const routes = require('./routes');

require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'public', 'uploads')));

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor NodeJS Rodando na porta: ' + PORT );
});