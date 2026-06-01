import { AppError } from "../utils/AppError.js";

export const validate = (schema) => {
    return (req, res, next) => {
        let data = { body: req.body, params: req.params, query: req.query };
        
        if (req.file || req.files) {
            data.file = req.file || req.files;
        }

        const { error } = schema.validate(data, { abortEarly: false });
        
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return next(new AppError(errorMessages.join(", "), 400));
        }
        
        next();
    };
};
