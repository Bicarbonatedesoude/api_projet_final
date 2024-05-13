const sql = require('../config/db_pg.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid'); // Importer uuid pour générer une clé API unique

const costFactor = 10;

const Utilisateur = function(utilisateur) {
    this.id = utilisateur.id;
    this.nom = utilisateur.nom;
    this.courriel = utilisateur.courriel;
    this.cle_api = utilisateur.cle_api;
    this.password = utilisateur.password;
};

Utilisateur.ajouter_Util = (req) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(req.body.password, costFactor, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                // Générer une clé API (s'il doit être généré automatiquement)
                const cleApi = generateUniqueAPIKey(); // Fonction à implémenter

                // Exécuter la requête SQL pour insérer un nouvel utilisateur
                const requete = 'INSERT INTO utilisateur (nom, courriel, cle_api, password) VALUES ($1, $2, $3, $4)';
                const params = [req.body.nom, req.body.courriel, cleApi, hash];

                sql.query(requete, params, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.rows); 
                    }
                });
            }
        });
    });
};

// Fonction pour générer une clé API unique
function generateUniqueAPIKey() {
    let cle = uuid.v4(); // Générer une nouvelle clé API UUID
    return cle; 
}


Utilisateur.verifUtilisateur = (req, res) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM utilisateur WHERE courriel = $1';
        sql.query(requete, req.body.courriel, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
};

Utilisateur.cree_Cle = (req, res) => {
    return new Promise((resolve, reject) => {
        let nouvelleCle = uuid.v4(); // Générer une nouvelle clé API UUID
        let requete = 'UPDATE utilisateur SET cle_api = $1 WHERE courriel = $2';
        let params = [nouvelleCle, req.body.courriel];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
};

Utilisateur.trouve_Util = (req, res) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM utilisateur WHERE courriel = $1';
        let params = req.body.courriel;
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
};

Utilisateur.cherche_Cle = (req, res) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM utilisateur WHERE cle_api = $1';
        let params = req.body.cle_api;
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
};

Utilisateur.valide_Cle = (cleApi) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM utilisateur WHERE cle_api = $1';
        let params = cleApi;
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
};

Utilisateur.verifCombinaison = (req, res) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM utilisateur WHERE courriel = $1';
        let params = req.body.courriel;
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
};

Utilisateur.regenerer_Cle = (req, res) => {
    return new Promise((resolve, reject) => {
        let nouvelleCle = uuid.v4(); // Générer une nouvelle clé API UUID
        let requete = 'UPDATE utilisateur SET cle_api = $1 WHERE courriel = $2';
        let params = [nouvelleCle, req.body.courriel];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
};

module.exports = Utilisateur;
