const Tache = require('../models/tache_models.js');
const SousTaches = require('../models/sous_tache_models.js');

// Créer une nouvelle tâche
exports.creerTache = (req, res) => {
    const { utilisateur_id, description, date_debut, date_echeance, complete } = req.body;

    // Vérifier les champs requis
    if (!utilisateur_id || !description || !date_debut || !date_echeance || complete === undefined) {
        return res.status(400).send({
            message: "Certains champs requis sont manquants"
        });
    }

    // Créer une nouvelle instance de Tache
    const nouvelleTache = new Tache({
        utilisateur_id,
        description,
        date_debut,
        date_echeance,
        complete
    });

    // Enregistrer la nouvelle tâche dans la base de données
    nouvelleTache.save((err, tacheCreee) => {
        if (err) {
            console.log('Erreur lors de la création de la tâche : ', err);
            return res.status(500).send({
                message: "Erreur lors de la création de la tâche"
            });
        }
        res.status(201).send({
            message: "La tâche a été créée avec succès",
            tache: tacheCreee
        });
    });
};

// Rechercher toutes les tâches de l'utilisateur
exports.trouveToutTaches = (req, res) => {
    const utilisateur_id = req.params.utilisateur_id;

    // Appeler la méthode statique trouveToutTaches du modèle Tache
    Tache.trouveToutTaches(utilisateur_id)
        .then((taches) => {
            res.status(200).send(taches);
        })
        .catch((err) => {
            console.log('Erreur lors de la recherche des tâches : ', err);
            res.status(500).send({
                message: "Erreur lors de la recherche des tâches"
            });
        });
};

// Rechercher une tâche spécifique de l'utilisateur
exports.trouve1Tache = (req, res) => {
    const id = req.params.id;

    // Vérifier si l'id de la tâche est valide
    if (!id || parseInt(id) <= 0) {
        return res.status(400).send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
    }

    // Vérifier la clé d'API
    Taches.verifierCle(req.headers.authorization, id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher la tâche associée à l'utilisateur
            Tache.trouver1({ _id: id, utilisateur_id: cle.utilisateur_id })
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

// Mettre à jour une tâche en la modifiant
exports.modifTache = (req, res) => {
    const id = req.params.id;
    const { utilisateur_id, description, date_debut, date_echeance, complete } = req.body;

    // Vérifier si l'id de la tâche est valide
    if (!id || parseInt(id) <= 0) {
        return res.status(400).send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
    }

    // Vérifier les champs requis
    var message = "";
    if (!utilisateur_id) {
        message += "utilisateur_id\r\n";
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
    Taches.verifierCle(req.headers.authorization, id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher la tâche associée à l'utilisateur
            Tache.trouve({ _id: id, utilisateur_id: cle.utilisateur_id })
                .then((tache) => {
                    if (!tache) {
                        return res.status(404).send({
                            message: `Tâche introuvable avec l'id ${id}`
                        });
                    }

                    // Mettre à jour la tâche
                    Tache.trouvemodifi(id, {
                        utilisateur_id,
                        description,
                        date_debut,
                        date_echeance,
                        complete
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

// Mettre à jour le statut d'une tâche
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
    Taches.verifierCle(req.headers.authorization, id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher la tâche associée à l'utilisateur
            Tache.trouver1({ _id: id, utilisateur_id: cle.utilisateur_id })
                .then((tache) => {
                    if (!tache) {
                        return res.status(404).send({
                            message: `Tâche introuvable avec l'id ${id}`
                        });
                    }

                    // Mettre à jour le statut de la tâche
                    Tache.rechercheIDModif(id, {
                        complete
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

// Supprimer une tâche
exports.supTache = (req, res) => {
    const id = req.params.id;

    // Vérifier si l'id de la tâche est valide
    if (!id || parseInt(id) <= 0) {
        return res.status(400).send({
            message: "L'id de la tâche est obligatoire et doit être supérieur à 0"
        });
    }

    // Vérifier la clé d'API
    Taches.verifierCle(req.headers.authorization, id)
        .then((cle) => {
            if (!cle) {
                return res.status(403).send({
                    message: "La tâche ne vient pas de cet utilisateur ou la clé d'API est invalide"
                });
            }

            // Rechercher et supprimer la tâche
            Tache.findByIdAndDelete(id)
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
        })
        .catch((erreur) => {
            console.log('Erreur lors de la vérification de la clé d\'API : ', erreur);
            res.status(500).send({
                message: "Échec lors de la vérification de la clé d'API"
            });
        });
};
