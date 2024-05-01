
const Tache = require('../models/tache_models.js');
const sousTache = require('../models/sous_tache_models.js');

const nouvelleTache = new Tache({
    titre: titre,
    description: description,
    date_debut: date_debut,
    date_echeance: date_echeance,
    complete: complete,
    id_utilisateur: utilisateur._id  // Assumer que l'utilisateur est trouvé
});

exports.creerTache = (req, res) => {
    const { titre, description, date_debut, date_echeance, complete } = req.body;

    // Vérifier les champs requis
    var message = "";
    if (!titre) {
        message += "titre\r\n";
    }
    if (!description) {
        message += "description\r\n";
    }
    if (!date_debut) {
        message += "date_debut\r\n";
    }
    if (!date_echeance) {
        message += "date_echeance\r\n";
    }
    if (complete == null) {
        message += "complete\r\n";
    }

    if (message !== "") {
        return res.status(400).send({
            champ_manquant: message
        });
    }

    Taches.chercherUtilisateur(req.headers.authorization.split(' ')[1])
        .then((utilisateur) => {
            if (!utilisateur) {
                return res.status(401).send({
                    message: "Utilisateur non trouvé ou non autorisé"
                });
            }

            // Enregistrer la nouvelle tâche dans la base de données
            nouvelleTache.save((err, tacheCree) => {
                if (err) {
                    return res.status(500).send({
                        message: "Erreur lors de la création de la tâche",
                        error: err.message || "Une erreur inconnue s'est produite"
                    });
                }
                res.status(201).send({
                    message: "La tâche a été créée avec succès",
                    tache: tacheCree
                });
            });
        })
        .catch((erreur) => {
            console.log('Erreur lors de la recherche de l\'utilisateur : ', erreur);
            res.status(500).send({
                message: "Erreur lors de la recherche de l'utilisateur"
            });
        });
};

exports.trouveToutTaches = (req, res) => {
    Taches.chercherUtilisateur(req.headers.authorization.split(' ')[1])
        .then((utilisateur) => {
            if (!utilisateur) {
                return res.status(401).send({
                    message: "Utilisateur non trouvé ou non autorisé"
                });
            }

            Tache.trouver({ id_utilisateur: utilisateur._id })
                .then((taches) => {
                    if (!taches || taches.length === 0) {
                        return res.status(404).send({
                            message: "Aucune tâche trouvée pour cet utilisateur"
                        });
                    }
                    res.status(200).send(taches);
                })
                .catch((erreur) => {
                    console.log('Erreur lors de la recherche des tâches : ', erreur);
                    res.status(500).send({
                        message: "Erreur lors de la recherche des tâches"
                    });
                });
        })
        .catch((erreur) => {
            console.log('Erreur lors de la recherche de l\'utilisateur : ', erreur);
            res.status(500).send({
                message: "Erreur lors de la recherche de l'utilisateur"
            });
        });
};


exports.trouve1Tache = (req, res) => {
    const id = req.params.id;

    // Vérifier si l'id de la tâche est valide
    if (!id || parseInt(id) <= 0) {
        return res.status(400).send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
    }

    // Vérifier la clé d'API
    Taches.verifierCle(req.headers.authorization.split(' ')[1], id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher la tâche associée à l'utilisateur
            Tache.trouver1({ _id: id, id_utilisateur: cle.id_utilisateur })
                .then((tache) => {
                    if (!tache) {
                        return res.status(404).send({
                            message: `Tâche introuvable avec l'id ${id}`
                        });
                    }

                    // Rechercher toutes les sous-tâches de la tâche
                    SousTaches.trouverToutesLesSousTaches(id)
                        .then((sousTaches) => {
                            res.status(200).send({
                                tache,
                                sousTaches
                            });
                        })
                        .catch((erreur) => {
                            console.log('Erreur lors de la recherche des sous-tâches : ', erreur);
                            res.status(500).send({
                                message: "Erreur lors de la récupération des sous-tâches"
                            });
                        });
                })
                .catch((erreur) => {
                    console.log('Erreur lors de la recherche de la tâche : ', erreur);
                    res.status(500).send({
                        message: "Erreur lors de la recherche de la tâche"
                    });
                });
        })
        .catch((erreur) => {
            console.log('Erreur lors de la vérification de la clé d\'API : ', erreur);
            res.status(500).send({
                message: "Échec lors de la vérification de la clé d'API"
            });
        });
};


exports.modifTache = (req, res) => {
    const id = req.params.id;
    const { titre, description, date_debut, date_echeance, complete } = req.body;

    // Vérifier si l'id de la tâche est valide
    if (!id || parseInt(id) <= 0) {
        return res.status(400).send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
    }

    // Vérifier les champs requis
    var message = "";
    if (!titre) {
        message += "titre\r\n";
    }
    if (!description) {
        message += "description\r\n";
    }
    if (!date_debut) {
        message += "date_debut\r\n";
    }
    if (!date_echeance) {
        message += "date_echeance\r\n";
    }
    if (complete == null) {
        message += "complete\r\n";
    }

    if (message !== "") {
        return res.status(400).send({
            champ_manquant: message
        });
    }

    // Vérifier la clé d'API
    Taches.verifierCle(req.headers.authorization.split(' ')[1], id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher la tâche associée à l'utilisateur
            Tache.trouve({ _id: id, id_utilisateur: cle.id_utilisateur })
                .then((tache) => {
                    if (!tache) {
                        return res.status(404).send({
                            message: `Tâche introuvable avec l'id ${id}`
                        });
                    }

                    // Mettre à jour la tâche
                    Tache.trouvemodifi(id, {
                        titre: titre,
                        description: description,
                        date_debut: date_debut,
                        date_echeance: date_echeance,
                        complete: complete
                    }, { new: true })
                        .then((tacheModifiee) => {
                            res.status(200).send({
                                message: "La tâche a été mise à jour avec succès",
                                tache: tacheModifiee
                            });
                        })
                        .catch((erreur) => {
                            console.log('Erreur lors de la mise à jour de la tâche : ', erreur);
                            res.status(500).send({
                                message: "Erreur lors de la mise à jour de la tâche"
                            });
                        });
                }
                )
                .catch((erreur) => {
                    console.log('Erreur lors de la recherche de la tâche : ', erreur);
                    res.status(500).send({
                        message: "Erreur lors de la recherche de la tâche"
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur lors de la vérification de la clé d\'API : ', erreur);
            res.status(500).send({
                message: "Échec lors de la vérification de la clé d'API"
            });
        });
}

exports.modifStatTache = (req, res) => {

    const id = req.params.id;
    const { complete } = req.body;

    // Vérifier si l'id de la tâche est valide
    if (!id || parseInt(id) <= 0) {
        return res.status(400).send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
    }

    // Vérifier les champs requis
    if (complete == null) {
        return res.status(400).send({
            message: "complete"
        });
    }

    // Vérifier la clé d'API
    Taches.verifierCle(req.headers.authorization.split(' ')[1], id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher la tâche associée à l'utilisateur
            Tache.trouver1({ _id: id, id_utilisateur: cle.id_utilisateur })
                .then((tache) => {
                    if (!tache) {
                        return res.status(404).send({
                            message: `Tâche introuvable avec l'id ${id}`
                        });
                    }

                    // Mettre à jour le statut de la tâche
                    Tache.rechercheIDModif(id, {
                        complete: complete
                    }, { new: true })
                        .then((tacheModifiee) => {
                            res.status(200).send({
                                message: "Le statut de la tâche a été mis à jour avec succès",
                                tache: tacheModifiee
                            });
                        })
                        .catch((erreur) => {
                            console.log('Erreur lors de la mise à jour du statut de la tâche : ', erreur);
                            res.status(500).send({
                                message: "Erreur lors de la mise à jour du statut de la tâche"
                            });
                        });
                }
                )
                .catch((erreur) => {
                    console.log('Erreur lors de la recherche de la tâche : ', erreur);
                    res.status(500).send({
                        message: "Erreur lors de la recherche de la tâche"
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur lors de la vérification de la clé d\'API : ', erreur);
            res.status(500).send({
                message: "Échec lors de la vérification de la clé d'API"
            });
        });
}

exports.supTache = (req, res) => {

    const id = req.params.id;

    // Vérifier si l'id de la tâche est valide
    if (!id || parseInt(id) <= 0) {
        return res.status(400).send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
    }

    // Vérifier la clé d'API
    Taches.verifierCle(req.headers.authorization.split(' ')[1], id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher la tâche associée à l'utilisateur
            Tache.trouverDelete({ _id: id, id_utilisateur: cle.id_utilisateur })
                .then((tache) => {
                    if (!tache) {
                        return res.status(404).send({
                            message: `Tâche introuvable avec l'id ${id}`
                        });
                    }

                    // Supprimer la tâche
                    Tache.rechercheID(id)
                        .then(() => {
                            res.status(200).send({
                                message: "La tâche a été supprimée avec succès"
                            });
                        })
                        .catch((erreur) => {
                            console.log('Erreur lors de la suppression de la tâche : ', erreur);
                            res.status(500).send({
                                message: "Erreur lors de la suppression de la tâche"
                            });
                        });
                }
                )
                .catch((erreur) => {
                    console.log('Erreur lors de la recherche de la tâche : ', erreur);
                    res.status(500).send({
                        message: "Erreur lors de la recherche de la tâche"
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur lors de la vérification de la clé d\'API : ', erreur);
            res.status(500).send({
                message: "Échec lors de la vérification de la clé d'API"
            });
        });
}