const mongoose = require("mongoose");

async function connect() {
  try {
    const mongoDBUrl =
      "mongodb+srv://vutuan23:MkO85CCY0jVFwFZd@Cluster.mtoyous.mongodb.net/db_laptop?retryWrites=true&w=majority";
    await mongoose.connect(mongoDBUrl);
    console.log("Connect successfully to DB");
  } catch (e) {
    console.log("Error connecting to DB: " + e);
  }
}

module.exports = { connect };
