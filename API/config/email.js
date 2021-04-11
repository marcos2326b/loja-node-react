// Descrição: Arquivo responsável por gerenciar o email

const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
}