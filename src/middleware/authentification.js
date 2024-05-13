
const Users = require("../models/utilisateur_model.js");

module.exports = (req, res, next) => {

    // Vérifier si la clé API est présente dans l'entête
    if(!req.headers.authorization) {
        return res.status(401).json({ message: "Vous devez fournir une clé api" });
    }

    // Récupérer la clé API
    // headers.authorization sert a recuperer la clé API
    // pour verifier si clé valide ou pas 
    // et split permet de separer la clé de l'entete 
    // [1] permet de recuperer la clé API en gros
     const cleApi = req.headers.authorization.split(' ')[1];
    // Vérifier si la clé API est valide
    Users.validationCle(cleApi)
    // Si la clé API est valide, on continue le traitement
    .then(resultat => {
        if(!resultat) {
            return res.status(401).json({ message: "Clé API invalide" });
        } else {
            // La clé API est valide, on continue le traitement
            next();
        }
    })
    .catch(erreur => {
        return res.status(500).json({ message: "Erreur lors de la validation de la clé api" })
    });    
}