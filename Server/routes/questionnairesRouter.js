const Router = require('express')
const router = new Router()
const questionnairesController = require('../controllers/questionnairesController')

router.post('/', questionnairesController.create)
router.get('/', questionnairesController.getAll)
router.get('/:id', questionnairesController.getOne)
router.post('/oneQuestionnaire/:id', questionnairesController.edit)

module.exports = router