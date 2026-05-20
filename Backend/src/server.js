import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startContestCron } from "./cron/contestCron.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  // Start contest result-processing cron after DB is ready
  startContestCron();
});
