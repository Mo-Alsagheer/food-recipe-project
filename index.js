import express from "express";
import { dbConnection } from "./config/dbConnection.js";
const app = express();

const startServer = async () => {
    await dbConnection();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};
startServer();