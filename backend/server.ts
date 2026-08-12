import app from "./app/app.js";
import config from "./config/config.js";
import mongoConnection from "./config/mongo-connection.js";

const PORT = config.PORT;

const startServer = async () => {
    // Initiate MongoDB Connection
    await mongoConnection();

    // Start Express app server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
