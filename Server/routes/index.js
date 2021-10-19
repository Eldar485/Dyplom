const Router = require('express')
const router = new Router()
const answerRouter = require('./answerRouter')
const questionnairesRouter = require('./questionnairesRouter')
const userRouter = require('./userRouter')

router.use('/user', userRouter)
router.use('/answer', answerRouter)
router.use('/questionnaires', questionnairesRouter)

module.exports = router