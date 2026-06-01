import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    ingredients: {
        type: [String],
        required: true,
        validate: { validator: (v) => v.length >= 1, message: "At least one ingredient is required" },
    },
    steps: {
        type: [String],
        required: true,
        validate: { validator: (v) => v.length >= 1, message: "At least one step is required" },
    },
    tags: {
        type: [String],
        default: [],
    },
    cookingTime: {
        type: Number,
        min: 1,
        default: null,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: null,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    image: {
        type: String,
        required: false,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true});

recipeSchema.index({ category: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ title: "text", description: "text" });

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;