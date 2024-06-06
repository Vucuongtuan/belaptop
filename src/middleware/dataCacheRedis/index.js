const { redisConfig } = require("../../config/redis.config");
const redis = require("redis");
const client = redis.createClient(redisConfig);

const getDataFromRedis = async (key) => {
  try {
    await client.connect();
    const result = await client.get(key);
    await client.disconnect();
    return result;
  } catch (err) {
    console.log("Error getting data from Redis:", err);
    throw err;
  }
};
module.exports = { getDataFromRedis };
