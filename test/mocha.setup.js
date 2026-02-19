import sequelize from '../app/database/database.js'

before(async() => {
  await sequelize.sync({ force: true })
})
after(async() => {
  await sequelize.close()
})
