const Router = require('express')
const router = new Router()
const statisticController = require('../controllers/statisticController')

router.get('/', statisticController.get)

module.exports = router