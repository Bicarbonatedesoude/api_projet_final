const express = require('express');
const router = express.Router(); 
const Controller_st = require('../controllers/sous_tache_controllers.js');


router.post('/', (req, res) => {
    Controller_st.creerSousTache(req, res);
    }
);
router.get('/liste', (req, res) => {
    Controller_st.trouvelesSousTaches(req, res)
    }
);
router.get('/:id', (req, res) => {
    Controller_st.trouve1SousTache(req, res);
    }
);
router.put('/:id', (req, res) => {
    Controller_st.modif1SousTache(req, res);
    }
);
router.put('/status/:id', (req, res) => {
    Controller_st.modifStatSousTache(req, res);
    }
);
router.delete('/:id', (req, res) => {
    Controller_st.supSousTache(req, res);
    }
);


module.exports = router;