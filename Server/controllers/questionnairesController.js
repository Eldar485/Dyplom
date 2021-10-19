const sequelize = require('sequelize')

const {oneQuestionnaire, Questions, Answers} = require('../models/models')
const ApiError = require('../error/ApiError')
class questionnairesController{
    async create(req, res, next){
        try{
            const {user, name} = req.body
            await oneQuestionnaire.create({
                userId: user,
                name: name
            })
            let ok = "ok"
            return res.json(ok)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async edit(req, res, next){
        try{
            const {id, name, questions} = req.body
            let questionsObj = JSON.parse(questions)
            console.log(questionsObj)
            await oneQuestionnaire.update({name: name.value}, {where: {id: id}}).then(async () => {
                for (let el of questionsObj) {
                    if(el.id){
                        await Questions.update({
                            oneQuestionnaireId: id,
                            question: el.name,
                            description: el.description,
                            options: el.options,
                            type: el.type
                        }, {where: {id: el.id}})
                    }
                    else{
                        await Questions.create({
                            oneQuestionnaireId: id,
                            question: el.name,
                            description: el.description,
                            options: el.options,
                            type: el.type
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
                attributes: ['id', 'description', 'question', 'options', 'type'],
                model: Questions,
            },
            group: ['questions.id', 'oneQuestionnaire.id'],
            }
        )
        const questionsIds = []
        questionnaire.questions.map(e => {questionsIds.push(e.id)})
        const a = await Answers.findAll({
            where: {questionId: questionsIds},
            attributes: ['questionId', [sequelize.fn('max', sequelize.col('answer')), 'Name'], [sequelize.fn('count', sequelize.col('answer')), 'count']],
            group: ['answer', 'questionId']
        })
        return res.json([questionnaire, a])
    }
}

module.exports = new questionnairesController()