import app from "./app/app.js";
import config from "./config/config.js";
import mongoConnection from "./config/mongo-connection.js";
import ApiResponse from "./utils/api-response.js";

const PORT = config.PORT;

const startServer = async () => {
    // Initiate MongoDB Connection
    await mongoConnection();

    // Health Check API
    app.get("/", (req, res) => { ApiResponse.success(res, "Health API Hit", 200) })

    // Start Express app server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
