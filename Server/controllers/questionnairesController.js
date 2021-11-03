const sequelize = require('sequelize')
const Op = sequelize.Op;

const {oneQuestionnaire, Questions, Answers, Links} = require('../models/models')
const ApiError = require('../error/ApiError')
class questionnairesController{
    async create(req, res, next){
        try{
            const questionnaire = await oneQuestionnaire.create({
                userId: 1,
                name: "Новая анкета"
            })
            return res.json(questionnaire)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next){
        try{
            const {id} = req.params
            await oneQuestionnaire.destroy({
                where: {id: id}
            })
            let ok = "ok"
            return res.json(ok)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async edit(req, res, next){
        let removeQuestions = []
        try{
            const {id, name, questions} = req.body
            let questionsObj = JSON.parse(questions)
            await oneQuestionnaire.update({name: name}, {where: {id: id}}).then(async () => {
                for (let el of questionsObj) {
                    if(el.id){
                        await Questions.update({
                            oneQuestionnaireId: id,
                            question: el.question,
                            description: el.description,
                            options: el.options,
                            type: el.type,
                            index: el.index
                        }, {where: {id: el.id}})
                    }
                    else{
                        await Questions.create({
                            oneQuestionnaireId: id,
                            question: el.question,
                            description: el.description,
                            options: el.options,
                            type: el.type,
                            index: el.index
                        })
                    }
                }
            })
            let ok = "ok"
            return res.json(ok)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteQuestion(req, res, next){
        try{
            const {id, index} = req.body
            await Questions.findAll({
                where: {index: {
                        [Op.gt]: index
                    }}
            }).then(async result => {
                for(let el of result){
                    await Questions.update({
                        index: el.index-1
                    },{where: {id: el.id}})
                }
            }).then(async () => {
                await Questions.destroy({
                    where: {id: id}
                })
            })
            let ok = "ok"
            return res.json(ok)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res){
        const questionnaire = await oneQuestionnaire.findAll()
        return res.json(questionnaire)
    }

    async getOne(req, res){
        const {id} = req.params
        const questionnaire = await oneQuestionnaire.findOne(
            {where: {id: id},
            attributes: ['id', 'name'],
            include: {
                attributes: ['id', 'description', 'question', 'options', 'type', 'index'],
                model: Questions,
            },
            group: ['questions.id', 'oneQuestionnaire.id'],
            }
        )
        return res.json(questionnaire)
    }

    async getAnswers(req, res){
        const questionsIds = []
        const {id} = req.params
        await oneQuestionnaire.findOne(
            {where: {id: id},
                include: {
                    attributes: ['id'],
                    model: Questions,
                },
                group: ['questions.id', 'oneQuestionnaire.id'],
            }).then(async result => {
            result.questions.map(e => {questionsIds.push(e.id)})
            await Answers.findAll({
                where: {questionId: questionsIds},
                attributes: ['questionId', [sequelize.fn('max', sequelize.col('answer')), 'Name'], [sequelize.fn('count', sequelize.col('answer')), 'count']],
                group: ['answer', 'questionId']
            }).then(result => {return res.json(result)})
        })
    }

    async getAnswersFull(req, res){
        const questionsIds = []
        const {id} = req.params
        await oneQuestionnaire.findOne(
            {where: {id: id},
                include: {
                    attributes: ['id'],
                    model: Questions,
                },
                group: ['questions.id', 'oneQuestionnaire.id'],
            }).then(async result => {
            result.questions.map(e => {questionsIds.push(e.id)})
            await Answers.findAll({
                where: {questionId: questionsIds},
                attributes: ['questionId', 'id', 'respondentId', 'answer'],
                group: ['answer', 'questionId', 'id', 'respondentId']
            }).then(result => {return res.json(result)})
        })
    }
}

module.exports = new questionnairesController()