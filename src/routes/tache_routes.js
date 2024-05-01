
const express = require('express');
const router = express.Router();



const controller_t = require('../controllers/tache.js');



router.post('/', (req, res) => {
    controller_t.creerTache(req, res);  
    }
);
router.post('/liste', (req, res) => {
    controller_t.trouveToutTaches(req, res)  
    }
);
router.get('/:id', (req, res) => {
    controller_t.trouve1Tache(req, res);     
    }
);
router.put('/:id', (req, res) => {
    controller_t.modifTache(req, res);    
    }
);
router.put('/status/:id', (req, res) => {
    controller_t.modifStatTache(req, res);     
    }
);
router.delete('/:id', (req, res) => {
    controller_t.supTache(req, res);       
    }
);


module.exports = router;
