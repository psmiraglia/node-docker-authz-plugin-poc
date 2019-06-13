const express = require('express')
const bodyParser = require('body-parser')


function getAuthzToken(req) {
  const { RequestHeaders } = req.body
  return RequestHeaders['X-Authz-Token']
}

function getRequestUri(req) {
  const { RequestUri } = req.body
  return RequestUri
}

function debugDockerCall(req, res, next) {
  console.log('')
  console.log(`-----BEGIN DOCKER CALL (${req.originalUrl})-----`)
  console.log(req.body)
  console.log('-----END DOCKER CALL-----')
  console.log('')
  next()
}

const app = express()
const port = 9999

app.use(bodyParser.json({'type': () => { return true }}))

app.use(debugDockerCall)

app.use('/Plugin.Activate', (req, res, next) => {
  res.json({
    Implements: ['authz']
  })
})

app.use('/AuthZPlugin.AuthzReq', (req, res, next) => {
  const regex = new RegExp('/v.*/containers/json.*')
  if ( getAuthzToken(req) === 'YES-I-CAN' ) {
    if ( regex.test(getRequestUri(req)) ) {
      res.json({
        allow: true
      })
    } else {
      res.json({
        allow: false,
        msg: `The URI ${getRequestUri(req)} is not allowed`
      })
    }
  } else {
    res.json({
      allow: false,
      msg: `The authorisation token is not valid`
    })
  }
})

app.use('/AuthZPlugin.AuthZRes', (req, res, next) => {
  res.json({
    allow: true
  })
})

app.listen(port)
