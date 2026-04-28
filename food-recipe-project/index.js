import express from "express";
import { dbConnection } from "./config/dbConnection.js";
const app = express();

// connect to database
dbConnection();

// server connection
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});