import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "layouts/base.tsx", [
    index("routes/home.tsx"),

    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),

    // Protected routes
    // route("/profile", "routes/profile.tsx"), // TODO: Create this route
    route("/logout", "routes/logout.tsx"),

    // Catch-all route
    route("*", "routes/notFound.tsx"),
  ]),
] satisfies RouteConfig;
