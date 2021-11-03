const Router = require('express')
const router = new Router()
const questionnairesController = require('../controllers/questionnairesController')

router.post('/', questionnairesController.create)
router.post('/:id', questionnairesController.delete)
router.get('/', questionnairesController.getAll)
router.get('/:id', questionnairesController.getOne)
router.get('/oneQuestionnaire/:id/answers', questionnairesController.getAnswers)
router.get('/oneQuestionnaire/:id/answersFull', questionnairesController.getAnswersFull)
router.post('/oneQuestionnaire/:id', questionnairesController.edit)
router.post('/oneQuestionnaire/:id/delete', questionnairesController.deleteQuestion)

module.exports = router