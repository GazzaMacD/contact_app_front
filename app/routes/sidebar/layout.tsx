import * as React from "react";
import {
  Outlet,
  Link,
  Form,
  NavLink,
  useNavigation,
  useSubmit,
} from "react-router";
import { getContacts } from "../../data";
import type { Route } from "../../routes/sidebar/+types/layout";
import type { ContactRecord } from "../../data";
import sbrLayoutStyles from "../../styles/sidebar.css?url";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export function links() {
  return [{ rel: "stylesheet", href: sbrLayoutStyles }];
}

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
              submit(e.currentTarget);
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
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) => {
                      return isActive ? "active" : isPending ? "pending" : "";
                    }}
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
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
