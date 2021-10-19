const {Answers, oneQuestionnaire, Questions} = require('../models/models')

class statisticController{
    async get(req, res){
        const {questionnaireId} = req.body
        const answer = await oneQuestionnaire.findOne({
            where: {id: questionnaireId},
            include: [{
                attributes: ['id', 'question', 'options'],
                model: Questions,
                include: [{
                    attributes: ['id', 'answer'],
                    model: Answers,
                }]
            }]
        })
        return res.json(answer)
    }
}

module.exports = new statisticController()