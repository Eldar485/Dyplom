const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
})

const oneQuestionnaire = sequelize.define('oneQuestionnaire', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
})

const Questions = sequelize.define('questions', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    question: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    options: {type: DataTypes.ARRAY(DataTypes.TEXT)},
    type: {type: DataTypes.STRING},
})

const Answers = sequelize.define('answers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    answer: {type: DataTypes.STRING},
})

const Links = sequelize.define('links', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    link: {type: DataTypes.STRING},
})

const Respondent = sequelize.define('respondent', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasMany(oneQuestionnaire)
oneQuestionnaire.belongsTo(User)

oneQuestionnaire.hasMany(Questions)
Questions.belongsTo(oneQuestionnaire)

Questions.hasMany(Answers)
Answers.belongsTo(Questions)

oneQuestionnaire.hasOne(Links)
Links.belongsTo(oneQuestionnaire)

Respondent.hasMany(Answers)
Answers.belongsTo(Respondent)

module.exports = {
    User,
    oneQuestionnaire,
    Questions,
    Answers,
    Respondent,
}