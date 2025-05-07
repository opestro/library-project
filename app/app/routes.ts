import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("ages", "routes/ages/index.tsx"),
  route("ages/:id", "routes/ages/$id.tsx"),
  route("categories", "routes/categories/index.tsx"),
  route("categories/:id", "routes/categories/$id.tsx"),
  route("documents", "routes/documents/index.tsx"),
  route("documents/:id", "routes/documents/$id.tsx")
] satisfies RouteConfig;
