const {Answers, Respondent} = require('../models/models')
const ApiError = require('../error/ApiError')
class answerController{
    async create(req, res, next){
        try{
            let respondent
            const {answers} = req.body
            let answersObj = JSON.parse(answers)
            console.log(answers)
            await Respondent.create({}).then( async result => {respondent = result.id
            for (let el of answersObj) {
                await Answers.create({
                    answer: el.answer,
                    questionId: el.questionId,
                    respondentId: respondent,
                })
            }})
            let ok = "ok"
            return res.json(ok)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new answerController()