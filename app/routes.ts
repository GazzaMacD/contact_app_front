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
    route("contacts/:contactId/edit", "routes/sidebar/contact-edit.tsx"),
  ]),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
