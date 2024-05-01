const tache = require('../models/tache_models.js');
const sous_tache = require('../models/sous_tache_models.js');
const bd = require('../config/db.js');


exports.creerSousTache = (req, res) => {
    const { tache_id, titre, complete } = req.body;

    // Vérifier les champs requis
    if (!tache_id || !titre || complete == null) {
        return res.status(400).send({
            champ_manquant: !tache_id ? "tache_id\r\n" : "",
            titre: !titre ? "titre\r\n" : "",
            complete: complete == null ? "complete\r\n" : ""
        });
    }

    // Vérifier si la tâche existe
    Taches.verifierUneTache(tache_id)
        .then((valeur) => {
            if (!valeur) {
                return res.status(404).send({
                    message: `La tache ${tache_id} n'existe pas`
                });
            }

            // Vérifier si la tâche appartient à l'utilisateur
            Taches.verifierCle(req.headers.authorization.split(' ')[1], tache_id)
                .then((cle) => {
                    if (!cle) {
                        return res.status(403).send({
                            message: "La tache ne vient pas de cet utilisateur"
                        });
                    }

                    // Créer la sous-tâche
                    const sousTache = new sous_tache({
                        id_tache: tache_id,
                        nom: titre,
                        description: req.body.description, // Ajouter la description depuis req.body
                        date_debut: req.body.date_debut, // Ajouter la date_debut depuis req.body
                        date_fin: req.body.date_fin, // Ajouter la date_fin depuis req.body
                        statut: req.body.statut // Ajouter le statut depuis req.body
                    });

                    // Sauvegarder la sous-tâche
                    sousTache.save()
                        .then((sousTacheData) => {
                            // Mettre à jour la tâche parente avec l'ID de la sous-tâche
                            tache.findByIdAndUpdate(tache_id, { $push: { sous_taches: sousTacheData._id } }, { new: true, useFindAndModify: false })
                                .then(() => {
                                    res.send({
                                        message: `La sous-tache ${titre} a été ajoutée avec succès`
                                    });
                                })
                                .catch((err) => {
                                    res.status(500).send({
                                        message: `Erreur lors de la mise à jour de la tâche parente avec la sous-tâche ${titre}`
                                    });
                                });
                        })
                        .catch((err) => {
                            res.status(500).send({
                                message: `Erreur lors de la création de la sous-tâche ${titre}`
                            });
                        });
                })
                .catch((err) => {
                    res.status(500).send({
                        message: "Échec lors de la vérification de la clé d'API"
                    });
                });
        })
        .catch((err) => {
            res.status(500).send({
                message: `Échec lors de la vérification de la tâche ${tache_id}`
            });
        });
};

exports.trouvelesSousTaches = (req, res) => {
    sous_tache.find()
        .then((sousTaches) => {
            res.send(sousTaches);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Erreur lors de la récupération des sous-tâches"
            });
        });
};

exports.trouve1SousTache = (req, res) => {
    sous_tache.findById(req.params.id)
        .then((sousTache) => {
            if (!sousTache) {
                return res.status(404).send({
                    message: `La sous-tâche ${req.params.id} n'existe pas`
                });
            }

            res.send(sousTache);
        })
        .catch((err) => {
            res.status(500).send({
                message: `Erreur lors de la récupération de la sous-tâche ${req.params.id}`
            });
        });
};


exports.modif1SousTache = (req, res) => {
    const { titre, complete } = req.body;
    const sousTacheId = req.params.id;

    // Vérifier les champs requis
    if (!titre || complete == null || !sousTacheId) {
        return res.status(400).send({
            champ_manquant: !titre ? "titre\r\n" : "",
            complete: complete == null ? "complete\r\n" : "",
            id: !sousTacheId ? "id\r\n" : ""
        });
    }

    // Vérifier si la sous-tâche existe
    verifierTache(sousTacheId)
        .then((sousTache) => {
            if (!sousTache) {
                return res.status(404).send({
                    message: `La sous-tâche ${sousTacheId} n'existe pas`
                });
            }

            // Vérifier si la tâche appartient à l'utilisateur
            verifierCle(req.headers.authorization.split(' ')[1], sousTacheId)
                .then((cle) => {
                    if (!cle) {
                        return res.status(403).send({
                            message: "La tâche ne vient pas de cet utilisateur"
                        });
                    }

                    // Modifier la sous-tâche
                    // Utilisez votre logique pour mettre à jour la sous-tâche ici
                    SousTaches.modifierUneSousTache(req)
                        .then((tache) => {
                            res.send({
                                message: `La sous-tâche ${sousTacheId} a été modifiée avec succès`,
                                sousTache: { id: sousTacheId, titre: titre, complete: complete }
                            });
                        })
                        .catch((erreur) => {
                            console.log('Erreur : ', erreur);
                            res.status(500).send({
                                message: `Échec lors de la modification de la sous-tâche ${sousTacheId}`
                            });
                        });
                })
                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500).send({
                        message: "Échec lors de la vérification de la clé d'API"
                    });
                });
        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500).send({
                message: `Échec lors de la vérification de la sous-tâche ${sousTacheId}`
            });
        });
};



exports.modifStatSousTache = (req, res) => {
    const { complete } = req.body;
    const sousTacheId = req.params.id;

    // Vérifier les champs requis
    if (complete == null || !sousTacheId) {
        return res.status(400).send({
            complete: complete == null ? "complete\r\n" : "",
            id: !sousTacheId ? "id\r\n" : ""
        });
    }

    // Vérifier si la sous-tâche existe
    verifierTache(sousTacheId)
        .then((sousTache) => {
            if (!sousTache) {
                return res.status(404).send({
                    message: `La sous-tâche ${sousTacheId} n'existe pas`
                });
            }

            // Vérifier si la tâche appartient à l'utilisateur
            verifierCle(req.headers.authorization.split(' ')[1], sousTacheId)
                .then((cle) => {
                    if (!cle) {
                        return res.status(403).send({
                            message: "La tâche ne vient pas de cet utilisateur"
                        });
                    }

                    // Modifier le statut de la sous-tâche
                    // Utilisez votre logique pour mettre à jour le statut de la sous-tâche ici
                    SousTaches.modifierStatusSousTache(req)
                        .then((tache) => {
                            res.send({
                                message: `Le statut de la sous-tâche ${sousTacheId} a été modifié avec succès`,
                                sousTache: { id: sousTacheId, complete: complete }
                            });
                        })
                        .catch((erreur) => {
                            console.log('Erreur : ', erreur);
                            res.status(500).send({
                                message: `Échec lors de la modification du statut de la sous-tâche ${sousTacheId}`
                            });
                        });
                })
                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500).send({
                        message: "Échec lors de la vérification de la clé d'API"
                    });
                });
        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500).send({
                message: `Échec lors de la vérification de la sous-tâche ${sousTacheId}`
            });
        });
};


exports.supSousTache = (req, res) => {
        const sousTacheId = req.params.id;
    
        // Vérifier si la sous-tâche existe
        verifierTache(sousTacheId)
            .then((sousTache) => {
                if (!sousTache) {
                    return res.status(404).send({
                        message: `La sous-tâche ${sousTacheId} n'existe pas`
                    });
                }
    
                // Vérifier si la tâche appartient à l'utilisateur
                verifierCle(req.headers.authorization.split(' ')[1], sousTacheId)
                    .then((cle) => {
                        if (!cle) {
                            return res.status(403).send({
                                message: "La tâche ne vient pas de cet utilisateur"
                            });
                        }
    
                        // Supprimer la sous-tâche
                        // Utilisez votre logique pour supprimer la sous-tâche ici
                        SousTaches.supprimerUneSousTache(req)
                            .then(() => {
                                res.send({
                                    message: `La sous-tâche ${sousTacheId} a été supprimée avec succès`,
                                    sousTache: { id: sousTacheId, tache: sousTache }
                                });
                            })
                            .catch((erreur) => {
                                console.log('Erreur : ', erreur);
                                res.status(500).send({
                                    message: `Échec lors de la suppression de la sous-tâche ${sousTacheId}`
                                });
                            });
                    })
                    .catch((erreur) => {
                        console.log('Erreur : ', erreur);
                        res.status(500).send({
                            message: "Échec lors de la vérification de la clé d'API"
                        });
                    });
            })
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500).send({
                    message: `Échec lors de la vérification de la sous-tâche ${sousTacheId}`
                });
            });
};
