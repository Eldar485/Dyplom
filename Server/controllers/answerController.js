const {Answers, Respondent} = require('../models/models')
const ApiError = require('../error/ApiError')
class answerController{
    async create(req, res, next){
        try{
            let respondent
            const {answers} = req.body
            let answersObj = JSON.parse(answers)
            await Respondent.create({}).then( async result => {respondent = result.id
            for (let el of answersObj) {
                if(el.answer.length > 0){
                    if(Array.isArray(el.answer)){
                        for(let element of el.answer){
                            await Answers.create({
                                answer: element,
                                questionId: el.questionId,
                                respondentId: respondent,
                            })
                        }
                    }
                    else{
                        await Answers.create({
                            answer: el.answer,
                            questionId: el.questionId,
                            respondentId: respondent,
                        })
                    }
                }
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