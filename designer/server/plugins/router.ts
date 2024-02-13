import { healthCheckRoute } from "./routes";
import { login } from '../login'
import { logout } from '../logout'
import { auth } from '../auth'

const routes = [
  healthCheckRoute,
  {
    method: "GET",
    path: "/robots.txt",
    options: {
      handler: {
        file: "server/public/static/robots.txt",
      },
    },
  },
  {
    method: "GET",
    path: "/assets/{path*}",
    options: {
      handler: {
        directory: {
          path: "./dist/client/assets",
        },
      },
    },
  },
  {
    method: "GET",
    path: "/help/{filename}",
    handler: function (request, h) {
      return h.view(`help/${request.params.filename}`);
    },
  },
];

export default {
  plugin: {
    name: "router",
    register: async (server, _options) => {
      await server.register([
        auth,
        login,
        logout
      ]);
      
      await server.route(routes);
    },
  },
};
