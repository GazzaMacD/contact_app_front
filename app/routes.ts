import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("routes/sbr_layout.tsx", [
    index("routes/sbr_home.tsx"),
    route("contacts/:contactId", "routes/sbr_contact.tsx"),
  ]),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
