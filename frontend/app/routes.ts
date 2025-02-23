import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "layouts/base.tsx", [
    index("routes/home.tsx"),

    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    route("/logout", "routes/logout.tsx"),
  ]),
] satisfies RouteConfig;
