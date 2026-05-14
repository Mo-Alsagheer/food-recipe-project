import { AppError } from "../utils/AppError.js";

export const validate = (schema) => {
    return (req, res, next) => {
        let filter = { ...req.body, ...req.params, ...req.query };
        
        if (req.file || req.files) {
            filter.file = req.file || req.files;
        }

        const { error } = schema.validate(filter, { abortEarly: false });
        
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return next(new AppError(errorMessages.join(", "), 400));
        }
        
        next();
    };
};
