import { Form, useFetcher } from "react-router";

import { getContact, updateContact } from "../../data";
import type { ContactRecord } from "../../data";
import type { Route } from "../../routes/sidebar/+types/contact";
import type { TContact } from "../../common/types";
import { fetchData } from "../../common/utils.server";

export async function loader({ params }: Route.LoaderArgs) {
  const url = `/contacts/${params.contactId}/`;
  const res = await fetchData<TContact>(null, url);
  //const contact = await getContact(params.contactId);
  if (res.status === "error") {
    throw new Response("Not found", { status: 404 });
  }
  const contact = res.data;
  return { contact };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.fn} avatar`}
          key={contact.avatar_url}
          src={contact.avatar_url ? contact.avatar_url : undefined}
        />
      </div>

      <div>
        <h1>
          {contact.fn ? <>{contact.fn}</> : <i>No Name</i>}
          <Favorite contact={contact} />
        </h1>

        {contact.non_latin_fn ? <p>{contact.non_latin_fn}</p> : null}

        {contact.x_handle ? (
          <p>
            <a href={`https://x.com/${contact.x_handle}`}>{contact.x_handle}</a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="delete"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
