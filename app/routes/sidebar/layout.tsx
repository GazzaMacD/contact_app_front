import { Outlet, Link, Form, NavLink, useNavigation } from "react-router";
import { getContacts } from "../../data";
import type { Route } from "../../routes/sidebar/+types/layout";
import type { ContactRecord } from "../../data";
import sbrLayoutStyles from "../../styles/sidebar.css?url";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}

export function links() {
  return [{ rel: "stylesheet", href: sbrLayoutStyles }];
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts } = loaderData;
  const navigation = useNavigation();

  return (
    <>
      <aside id="sidebar">
        <h1>
          <Link to="about">Contacts</Link>
        </h1>
        <div>
          <Form id="search-form" role="search">
            <input
              aria-label="Search contacts"
              id="q"
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={true} id="search-spinner" />
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
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </main>
    </>
  );
}
