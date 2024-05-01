const express = require('express');
const router = express.Router(); 
const ajouter_u = require('../controllers/utilisateur_controllers.js');
const { valide_Cle } = require('../models/utilisateur_model.js');

router.post('/', (req, res) => {
    ajouter_u.ajouter_Util(req, res);
    }
);
route.get('/verif', (req, res) => {
    ajouter_u.verifUtilisateur(req, res);
    }
);

router.post('/cle', (req, res) => {
    ajouter_u.cree_Cle(req, res);
    }
);

router.get('/trouve', (req, res) => {
    ajouter_u.trouve_Util(req, res);
    }
);
router.get('/cle', (req, res) => {
    ajouter_u.cherche_Cle(req, res);
    }
);
router.get('/valide', (req, res) => {
    valide_Cle(req, res);
    }
);
router.get('/verif', (req, res) => {
    verifCombinaison(req, res);
      }
);

module.exports = router;