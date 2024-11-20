import { EventPayload, GSIManager } from "../src";

// Inicializa o GSIManager
const gsiManager = new GSIManager(3000, "production");

// Listener on event "newclient"
gsiManager.on("newClient", (client) => {
  console.log(
    "New client connection, IP address: " +
      client.ip +
      ", Auth token: " +
      client.auth
  );
});

// Listener on event "draft:activeteam_time_remaining"
gsiManager.on("draft:activeteam_time_remaining", (data: EventPayload) => {
  console.log("draft timer remaining", data);
});

// Start server
gsiManager.start();
