//PAGE DE BASE DE LA PAGE, C'EST ICI QUE TOUT COMMENCE

console.log("T'es tu prêt");
const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
var  morgan = require('morgan');
var path = require('path');
var fs = require('fs')
dotenv.config();
const cleAPI = process.env.cleAPI;
const router = express.Router();
const app = express();
const PORT = 4000;

app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode != 500 },
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  }))


app.use(express.json());
app.use(express.urlencoded({ extended: rue }));
const db = require("./.src/config/db.js");

//initier swagger-ui + DOCUMENTATIONS
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./.src/config/documentation.json');
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};

const listeRoutes = require('./.src/routes/liste_routes.js');

const authentification = require('./src/middleware/authentification.middleware');


app.use(express.json())
app.use('/api/taches',authentification, require('./src/routes/api/taches'));
app.use('/api/sousTaches',authentification, require('./src/routes/api/sousTaches'));
app.use('/api/users', require('./src/routes/api/user'));


app.use('/api', listeRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.get('/', (req, res) => {
    res.send("<h1>Mon 10e serveur web sur express !</h1>");
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});