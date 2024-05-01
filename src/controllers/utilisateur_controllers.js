const utilisateur = require('../models/utilisateur_model.js');
const bcrypt = require('bcrypt');

exports.ajouter_Util = (req, res) => {
    const { nom, prenom, cle_api, courriel, password } = req.body;

    // Vérification des champs requis
    const messages = [];
    if (!nom) {
        messages.push("nom");
    }
    if (!prenom) {
        messages.push("prenom");
    }
    if (!courriel) {
        messages.push("courriel");
    }
    if (!password) {
        messages.push("password");
    }
    
    // Vérification si des champs sont manquants
    if (messages.length > 0) {
        return res.status(400).send({
            erreur: "Champs manquants",
            champ_manquant: messages
        });
    }

    // Vérification si l'utilisateur existe déjà avec cet email
    utilisateur.trouve_Util({ courriel })
        .then((user) => {
            if (user) {
                return res.status(400).send({
                    message: "L'email est déjà utilisé"
                });
            }

            // Hachage du mot de passe
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            // Création de l'utilisateur dans la base de données
            utilisateur.ajouter_Util({
                nom,
                prenom,
                courriel,
                cle_api,
                password: hash
                
            })
            .then((newUser) => {
                res.status(201).send({
                    message: `L'utilisateur ${prenom} ${nom} a été ajouté avec succès`,
                    cle_api: newUser
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || 'Erreur lors de la création de l\'utilisateur'
                });
            });
        })
        .catch((error) => {
            console.log('Erreur lors de la recherche de l\'utilisateur existant : ', error);
            res.status(500).send({
                message: "Erreur lors de la recherche de l'utilisateur existant"
            });
        });
};


exports.cree_Cle = (req, res) => {
    const { courriel, password } = req.body;

    // Vérification des champs requis
    if (!courriel || !password) {
        return res.status(400).send({
            message: "Champs email ou mot de passe manquants"
        });
    }

    // Recherche de l'utilisateur par email
    utilisateur.verifCombinaison(req.body)
        .then((user) => {
            if (!user) {
                return res.status(404).send({
                    message: "Utilisateur non trouvé"
                });
            }

            // Comparaison du mot de passe
            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    message: "Mot de passe invalide"
                });
            }

            // Création de la clé API
            utilisateur.cree_Cle({
                courriel
            })
            .then((result) => {
                res.status(200).send({
                    message: "Clé API créée avec succès",
                    cle_api: result
                });
            })
            .catch((err) => {
                res.status(500).send({
                    message: err.message || 'Erreur lors de la création de la clé API'
                });
            });
        })
        .catch((error) => {
            console.log('Erreur lors de la recherche de l\'utilisateur : ', error);
            res.status(500).send({
                message: "Erreur lors de la recherche de l'utilisateur"
            });
        });

};
