const server = require("mock-json-server");
const app = server(
  {
    "/health-status": {
      post: {},
    },
  },
  3001
);

app.start();
