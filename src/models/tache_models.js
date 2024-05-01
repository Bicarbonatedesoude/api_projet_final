

const bd = require('../.src/config/db.js');

module.exports = {};

const Tache = function(tache) {
    this.utilisateur_id = tache.utilisateur_id;
    this.titre = tache.titre;
    this.description = tache.description;
    this.date_debut = tache.date_debut;
    this.date_echeance = tache.date_echeance;
    this.complete = tache.complete;
}

Tache.creerTache = (req, id) => {
    return new Promise((resolve, reject) => {
        let requete = 'INSERT INTO tache(utilisateur_id, titre, description, date_debut, date_echeance, complete) VALUES ($1, $2, $3, $4, $5, $6);';
        let params = [id, req.body.titre, req.body.description, req.body.date_debut, req.body.date_echeance, req.body.complete];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

Tache.trouverToutesLesSousTaches = (id) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM sous_tache WHERE tache_id = $1;';
        let params = [id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}


Tache.trouveToutTaches = (id) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM tache WHERE utilisateur_id = $1;';
        let params = [id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
} 

Tache.trouve1Tache = (req, id) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM tache WHERE id = $1 AND utilisateur_id = $2;';
        let params = [req.params.id, id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

Tache.modifTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'UPDATE tache SET titre = $1, description = $2, date_debut = $3, date_echeance = $4 WHERE id = $5;';
        let params = [req.body.titre, req.body.description, req.body.date_debut, req.body.date_echeance, req.params.id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

Tache.modifStatTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'UPDATE tache SET complete = $1 WHERE id = $2;';
        let params = [req.body.complete, req.params.id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

Tache.supTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'DELETE FROM tache WHERE id = $1;';
        let params = [req.params.id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

Tache.verifTache = (id) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM tache WHERE id = $1;';
        let params = [id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

Tache.chercheUtilisateur = (cle) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM utilisateur WHERE cle_api = $1;';
        let params = [cle];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

Tache.verifcle = (cle, id) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT cle_api From utilisateur INNER JOIN tahces on utilisateur_id = utilisateur.id WHERE id = $1 AND utilisateur_id = $2;';
        let params = [cle, id];
        bd.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}