const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const onlineEmployees = new Set();

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });
});
const updateEmployeeLoginStatus = (
  employeeId,
  employeeName,
  employeePositon
) => {
  onlineEmployees.add({ id: employeeId, name: employeeName });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "login",
          id: employeeId,
          name: employeeName,
        })
      );
    }
  });
};
const updateEmployeeLogoutStatus = (employeeId) => {
  onlineEmployees.delete(employeeId);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "logout",
          id: employeeId,
        })
      );
    }
  });
};

module.exports = {
  onlineEmployees,
  updateEmployeeLoginStatus,
  updateEmployeeLogoutStatus,
};
