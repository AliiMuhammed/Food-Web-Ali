// const cron = require("cron");
// const Table = require("../models/tablesModel");
// const Bookings = require("../models/bookingModel");

// const resetTablesAndDeleteBookings = async () => {
//   try {
//     await Table.updateMany({}, { reserved: false });

//     await Bookings.deleteMany({});

//     console.log("All tables have been reset and bookings deleted.");
//   } catch (err) {
//     console.error("Error resetting tables or deleting bookings:", err);
//   }
// };

// // Schedule the task to run every day at midnight (Egypt local time)
// const job = new cron.CronJob(
//   "0 0 * * *", // Cron expression for midnight daily
//   resetTablesAndDeleteBookings,
//   null, // No completion callback
//   true, // Start the job right now
//   "Africa/Cairo"
// );

// const startCronJob = () => {
//   job.start();
// };

// module.exports = startCronJob;
