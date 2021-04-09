const compression = require('Compression')
const express = require('express')
// const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT || 3000

// Public
app.use('/public', express.static(__dirname + '/public'))
app.use('/public/images', express.static(__dirname + '/public/images'))

// MongodDB
const dbs = require('./config/database')
const dbURI = isProduction ? dbs.dbProdution : dbs.dbTest
mongoose.connect(dbURI, { useNewUrlParser: true })

// EJS
app.set('view engine', 'ejs')

// Configs
if(!isProduction) app.use(morgan('dev'))
app.use(cors())
app.disable('x-powered-by')
app.use(compression())

// Body Parser
app.use(bodyParser.urlencoded({ extended: false, limit: 1.5*1024*1024 }))
app.use(bodyParser.json({ limit:1.5*1024*1024 }))

// Models - Routes
require('./models')
app.use('/', require('./routes'))

// 404
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next()
})

// 422, 500, 401 ...
app.use((error, req, res) => {
  res.status(error.status || 500)
  if(error.status !== 404)  console.warn('Error: ', error.message, new Date());
  res.json({ errors: { message: error.message, status: error.status } })
})

// Executando
app.listen(PORT, (error) => {
  if(error) throw error
  console.log(`Acessar http://localhost:${PORT}`);
  console.log(`Servidor executando na porta ${PORT}!!`);
})