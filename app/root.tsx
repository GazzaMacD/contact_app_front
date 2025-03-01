import {
  Form,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  Outlet,
  Link,
  Links,
  Meta,
  redirect,
} from "react-router";
import appStyles from "./styles/app.css?url";
import type { Route } from "./+types/root";
import { createEmptyContact } from "./data";
import { fetchData } from "./common/utils.server";
import type { TContact } from "./common/types";
import { ERROR_MSGS } from "./common/error_messages";

export function links() {
  return [{ rel: "stylesheet", href: appStyles }];
}

export function HydrateFallback() {
  return (
    <div id="loading-splash">
      <div id="loading-splash-spinner" />
      <p>Loading, please wait...</p>
    </div>
  );
}

export async function action() {
  const newContactObj = {
    pub_id: "",
    fn: "No Name",
    non_latin_fn: "",
    favorite: false,
    x_handle: "",
    avatar_url: "",
    notes: "",
  };
  const res = await fetchData<TContact>(null, "/contacts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContactObj),
  });
  if (!res.success) {
    // to be caught by the nearest error boundary
    throw new Response(ERROR_MSGS[res.status].msg, { status: res.status });
  }
  const contact = res.data;
  return redirect(`/contacts/${contact.pub_id}/edit`);
}

export default function App() {
  return <Outlet />;
}

// The Layout component is a special export for the root route.
// It acts as your document's "app shell" for all route components, HydrateFallback, and ErrorBoundary
// For more information, see https://reactrouter.com/explanation/special-files#layout-export
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// The top most error boundary for the app, rendered when your app throws an error
// For more information, see https://reactrouter.com/start/framework/route-module#errorboundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = String(error.status);
    details = ERROR_MSGS[error.status].msg;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main id="error-page">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
