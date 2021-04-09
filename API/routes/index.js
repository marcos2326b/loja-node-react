const router = require('express').Router()

router.use('/v1/api', require('./api/v1/'))
router.get('/', (req, res) => {
  res.send({ ok: true })
})

router.use(function(error, req, res) {
  if(error.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(error.errors).reduce(function(errors, key) {
        errors[key] = error.errors[key.message]
        return errors
      }, {})
    })
  }
})

module.exports = router