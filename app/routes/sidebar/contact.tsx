import { Form, useFetcher } from "react-router";

import { getContact, updateContact } from "../../data";
import type { ContactRecord } from "../../data";
import type { Route } from "../../routes/sidebar/+types/contact";
import type { TContact } from "../../common/types";
import { fetchData, base } from "../../common/utils.server";
import { ERROR_MSGS } from "../../common/error_messages";

export async function loader({ params }: Route.LoaderArgs) {
  const url = `/contacts/${params.contactId}/`;
  const res = await fetchData<TContact, null>(null, url);
  //const contact = await getContact(params.contactId);
  if (!res.success) {
    // to be caught by the nearest error boundary
    throw new Response(ERROR_MSGS[res.status].msg, { status: res.status });
  }
  const contact = res.data;
  return { contact, base };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const url = `/contacts/${params.contactId}/`;
  try {
    const res = await fetchData<TContact, null>(null, url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        favorite: formData.get("favorite") === "true",
      }),
    });
    if (!res.success) {
      // to be caught by the nearest error boundary
      throw new Response(ERROR_MSGS[res.status].msg, { status: res.status });
    }
    return res.data;
  } catch (error) {
    throw new Response(ERROR_MSGS[500].msg, { status: 500 });
  }
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact, base } = loaderData;

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.fn} avatar`}
          key={
            contact.profile_image
              ? contact.profile_image
              : contact.avatar_url
                ? contact.avatar_url
                : contact.pub_id
          }
          src={
            contact.profile_image
              ? `${base.url}${contact.profile_image}`
              : contact.avatar_url
                ? contact.avatar_url
                : "/images/default_profile.jpg"
          }
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
            method="delete"
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
