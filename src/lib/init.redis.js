const { createClient } = require("redis");
let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  },
  connectionTimeout;
const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNECT_MESSAGE = {
    code: -90,
    message: {
      vn: "Redis loi",
      en: "Service connection redis error",
    },
  };
const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    const status = {
      status: "Error",

      message: REDIS_CONNECT_MESSAGE.message.vn,
    };
    throw status;
  }, REDIS_CONNECT_TIMEOUT);
};
const handleEventConnect = async (connectionRedis) => {
  await client.product.connect();
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("=============Connect-redis=============");
    console.log("Connection Redis successfully connected");
    console.log("====================================");
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("Connection Redis END ");
    handleTimeoutError();
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("Connection Redis RECONNECT ");
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log("Connection Redis ERROR :", err);
    handleTimeoutError();
  });
};
const initRedis = async () => {
  try {
    const instanRedis = createClient({
      legacyMode: true,
      url: process.env.PRODUCTION_REDIS,
    });
    client.product = instanRedis;
    handleEventConnect(instanRedis);
    // handleTimeoutError();
  } catch (err) {
    console.error("Error creating Redis client:", err);
    const status = {
      status: "Error",
      message: REDIS_CONNECT_MESSAGE.message.vn,
    };
    throw status;
  }
};
const getRedis = () => client;
const closeRedis = () => {
  console.log("====================================");
  console.log("redis disconnect");
  console.log("====================================");
};
module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
