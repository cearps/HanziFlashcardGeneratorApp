import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "layouts/base.tsx", [
    index("routes/home.tsx"),

    route("/login", "routes/auth/login.tsx"),
    route("/register", "routes/auth/register.tsx"),

    // Protected routes
    route("/app", "routes/protectedRoute.tsx", [
      index("routes/app/dashboard.tsx"),
      route("profile", "routes/app/profile.tsx"),
      route("settings", "routes/app/settings.tsx"),
      route("logout", "routes/auth/logout.tsx"),
      // Wordlist routes
      route("wordlist/wordlists", "routes/app/wordlist/wordlists.tsx"),
      route("wordlist/create", "routes/app/wordlist/create.tsx"),
      route("wordlist/:id", "routes/app/wordlist/detail.tsx"),
    ]),

    // Catch-all route
    route("*", "routes/notFound.tsx"),
  ]),
] satisfies RouteConfig;
