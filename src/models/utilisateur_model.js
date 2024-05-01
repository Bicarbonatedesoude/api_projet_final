
const sql = require('../config/db_pg.js');
const bcrypt = require('bcrypt');
const costFactor = 10;
const uuidv4 = require('uuid/v4');

const Utilisateur = function(utilisateur) {
    this.id = utilisateur.id;
    this.nom = utilisateur.nom;
    this.prenom = utilisateur.prenom;
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
                let requete = 'INSERT INTO utilisateur (nom, prenom, courriel, cle_api, password) VALUES ($1, $2, $3, $4, $5)';
                let params = [req.body.nom, req.body.prenom, req.body.courriel, req.body.cle_api, hash];
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
}


Utilisateur.cree_Cle = (req, res) => {
    return new Promise((resolve, reject) => {
        let requete = 'UPDATE utilisateur SET cle_api = ? WHERE courriel = $1';
        let params = [uuidv4(), req.body.courriel];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    }
    );
}


Utilisateur.trouve_Util = (req, res) => {
    utilisateur.trouve_Util = (req, res) => {
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
    }
}

Utilisateur.cherche_Cle = (req, res) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM utilisateur WHERE cle = $1';
        let params = req.body.cle_api;
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    }
    );
}



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
}

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
}


module.exports = Utilisateur;