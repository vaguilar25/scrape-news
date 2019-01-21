var express = require('express');
var router = express.Router();
var newsController = require('../controllers/newsController.js');


/*
 * POST NOTE
 */
router.post('/notes/:id', newsController.createNote);
/*
 * GET NOTE
 */
router.get('/notes/:id', newsController.showNote);
/*
 * GET
 */
router.get('/', newsController.list);

/*
 *SCRAP
 */
router.get('/scrap',newsController.scrap);


router.get('/saved',newsController.listSaved);



/*
 * GET
 */
router.get('/:id', newsController.show);

/*
 * POST
 */
router.post('/', newsController.create);

/*
 * PUT
 */
router.put('/:id', newsController.update);

/*
 * DELETE
 */
router.delete('/:id', newsController.remove);

module.exports = router;
