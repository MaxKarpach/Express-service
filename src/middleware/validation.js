const Joi = require('joi')

const userValidationSchema = Joi.object({
  fullName: Joi.string().max(100).required(),
  dateOfBirth: Joi.date().max(new Date()).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'user').default('user'),
  isActive: Joi.boolean().default(true)
})

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ 
      status: 'error', 
      message: error.details[0].message 
    });
  }
  next()
}

const validateLogin = (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ 
      status: 'error', 
      message: error.details[0].message 
    })
  }
  next()
}

module.exports = {
  validateUser,
  validateLogin
}