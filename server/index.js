/* eslint-disable import/order */
const port = 9999
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const cors = require('cors')
const db = require('./db.config.js')
const socketEvents = require('./socketEvents')
process.env.NODE_ENV = 'development'
const api = require('./apis')(db, [
  'user',
  'eligibility',
  'back-office/boUser',
  'back-office/boEligibility',
  'blocked',
  'cedex',
  'status',
  'personnality_test/personnality_question',
  'personnality_test/personnality_answer',
  'chat/conversation',
  'chat/message',
  'certification'
])
// app.use(cors())
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  )
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Access-Control-Allow-Origin , X-Requested-With, x-authenticate, Content-Type, Accept'
  )
  next()
})
app.use(bodyParser.json())
app.use(`/api/v${api.version}`, api.routers)
// ci-dessus prefixer chaque route des API par api/v1/ + associer routers à l'app
app.set('trust proxy', true)
app.use(express.static(`${__dirname} + public`))

// const { connection } = require('./mailjet.config.js')
// const data_Welcome = require('./apis/mailjet/mails_configs/welcome')
// const data_Newsletter = require('./apis/mailjet/mails_configs/newsletter')
// const sendWithMailjet = require('./apis/mailjet/mailjet_sendMail');
// sendWithMailjet(connection, data_Newsletter([{Email: "l.lebreton@matrimonline.fr", Name: "Laurianne"}]));
// sendWithMailjet(connection, data_Welcome([{Email: "l.lebreton@matrimonline.fr", Name: "Laurianne"}]));

// SOCKEEEEEEEEET
const http = require('http').createServer(app)
const io = require('socket.io')(http)
socketEvents(io)
app.get('/', (req, res) => {
  res.send('root@my-api')
})

console.log('node server running @ http://localhost:' + port)

http.listen(port)
