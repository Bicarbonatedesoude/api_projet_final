const sql = require('..config/db_pg.js');

const SousTache = function(sous_tache) {
    this.tache_id = sous_tache.tache_id;
    this.titre = sous_tache.titre;
    this.complete = sous_tache.complete;
}

SousTache.creerSousTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'INSERT INTO sous_tache(tache_id, titre, complete) VALUES ($1, $2, $3);';
        let params = [req.body.tache_id, req.body.titre, req.body.complete];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

SousTache.trouvelesSousTaches = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM sous_tache WHERE tache_id = $1;';
        let params = [req.body.tache_id];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

SousTache.modif1SousTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'UPDATE sous_tache SET titre = $1, complete = $2 WHERE id = $3;';
        let params = [req.body.titre, req.body.complete, req.params.id];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

SousTache.modifStatSousTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'UPDATE sous_tache SET complete = $1 WHERE id = $2;';
        let params = [req.body.complete, req.params.id];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

SousTache.verifSousTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'SELECT * FROM sous_tache WHERE id = $1;';
        let params = [req.params.id];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

SousTache.supSousTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'DELETE FROM sous_tache WHERE id = $1;';
        let params = [req.params.id];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}

SousTache.supSousTacheTache = (req) => {
    return new Promise((resolve, reject) => {
        let requete = 'DELETE FROM sous_tache WHERE tache_id = $1;';
        let params = [req.params.id];
        sql.query(requete, params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.rows);
            }
        });
    });
}
