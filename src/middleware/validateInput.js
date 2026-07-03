const joi = require("joi");

const inputSchema = joi.object({
  message: joi.string().required().max(10)
});


const validateInput = (req, res, next) => {
    const { error } = inputSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};


module.exports = validateInput;