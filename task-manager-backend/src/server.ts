import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes";
import { errorHandler } from "./middleware";
import { checkTaskTimeouts } from "./controllers";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(router);
app.use(errorHandler);

// Run the timeout check every 5 minutes
setInterval(checkTaskTimeouts, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
