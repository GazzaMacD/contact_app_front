import * as React from "react";
import {
  Outlet,
  Link,
  Form,
  NavLink,
  useNavigation,
  useSubmit,
  data,
} from "react-router";
import { getContacts } from "../../data";
import type { Route } from "../../routes/sidebar/+types/layout";
import type { ContactRecord } from "../../data";
import sbrLayoutStyles from "../../styles/sidebar.css?url";
import { fetchData } from "../../common/utils.server";
import { ERROR_MSGS } from "../../common/error_messages";

import type { TContacts } from "../../common/types";

/*
 * Server Code
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const res = await fetchData<TContacts>(null, "/contacts/");
  if (!res.success) {
    // to be caught by the nearest error boundary
    throw new Response(ERROR_MSGS[res.status].msg, { status: res.status });
  }
  const contacts = res.data;
  return { contacts, q };
}

export function links() {
  return [{ rel: "stylesheet", href: sbrLayoutStyles }];
}

/*
 * Client Code
 */
export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  React.useEffect(() => {
    const searchField = document.getElementById("search-form");
    if (searchField instanceof HTMLFormElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <aside id="sidebar">
        <h1>
          <Link to="about">Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={(e) => {
              const isFirstSearch = q === null;
              submit(e.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
          >
            <input
              aria-label="Search contacts"
              id="q"
              defaultValue={q || ""}
              className={searching ? "loading" : ""}
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.pub_id}>
                  <NavLink
                    className={({ isActive, isPending }) => {
                      return isActive ? "active" : isPending ? "pending" : "";
                    }}
                    to={`contacts/${contact.pub_id}`}
                  >
                    {contact.fn ? <>{contact.fn}</> : <i>No Name</i>}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </aside>
      <main
        id="detail"
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
      >
        <Outlet />
      </main>
    </>
  );
}
