import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("routes/sidebar/layout.tsx", [
    index("routes/sidebar/home.tsx"),
    route("contacts/:contactId", "routes/sidebar/contact.tsx"),
  ]),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
