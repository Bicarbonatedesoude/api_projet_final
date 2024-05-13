console.log("T'es tu prêt");
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PG_PORT;

// Configurer Morgan pour le journal d'accès
app.use(morgan('combined', {
    skip: function (req, res) { return res.statusCode != 500 },
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));

//const mysql = require('mysql');
//const cleAPI = process.env.cleAPI;
//const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const utilisateurRoutes = require('./src/routes/utilisateur_route.js');
const db = require("./src/config/db_pg.js");

//initier swagger-ui + DOCUMENTATIONS
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/config/documentation.json');
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Demo API"
};
const authentification = require('./src/middleware/authentification.js');

app.use(express.json())
app.use('/api/users', utilisateurRoutes);
app.use('/api/taches',authentification, require('./src/routes/tache_routes.js'));
app.use('/api/sousTaches',authentification, require('./src/routes/sous_tache_routes.js'));
app.use('/api/users', require('./src/routes/utilisateur_route.js'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.get('/', (req, res) => {
    res.send("<h1>Mon 10e serveur web sur express !</h1>");
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});



