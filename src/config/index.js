const mongoose = require("mongoose");
const { ProductLaptop, Mouse, Keybourd } = require("../models");

async function connect() {
  try {
    const mongoDBUrl =
      "mongodb+srv://vutuan23:MkO85CCY0jVFwFZd@Cluster.mtoyous.mongodb.net/db_laptop?retryWrites=true&w=majority";
    await mongoose.connect(mongoDBUrl);
    const laptopChangeStream = ProductLaptop.watch();
    laptopChangeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        await AllProduct.create(change.fullDocument);
      }
    });

    const mouseChangeStream = Mouse.watch();
    mouseChangeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        await AllProduct.create(change.fullDocument);
      }
    });

    const keyboardChangeStream = Keybourd.watch();
    keyboardChangeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        await AllProduct.create(change.fullDocument);
      }
    });

    console.log("Connect successfully to DB");
  } catch (e) {
    console.log("Error connecting to DB: " + e);
  }
}

module.exports = { connect };
