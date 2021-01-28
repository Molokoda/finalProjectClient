const Joi = require('react-native-joi');
 
const regScheme = Joi.object().keys({
    login: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    name: Joi.string().alphanum().min(3).max(30).required(),
})

export default regScheme;