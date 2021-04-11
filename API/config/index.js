const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : process.env.SECRET,
  api: process.env.NODE_ENV === 'production' ? 'https://api.loja-teste.ampliee.com' : 'http://localhost:3000',
  loja: process.env.NODE_ENV === 'production' ? 'https://loja-teste.ampliee.com' : 'http://localhost:8000'
}