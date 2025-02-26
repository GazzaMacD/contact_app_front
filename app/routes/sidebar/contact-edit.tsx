import { Form, redirect, useNavigate } from "react-router";

import type { Route } from "../../routes/sidebar/+types/contact-edit";
import { getContact, updateContact } from "../../data";
import type { TContact } from "../../common/types";
import { fetchData } from "../../common/utils.server";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  // currently no validation yet, use zod
  const updates = Object.fromEntries(formData);
  const url = `/contacts/${params.contactId}/`;
  const res = await fetchData<TContact>(null, url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (res.status === "error") {
    //THis should change, not handling errors
    throw new Response("Not found", { status: 404 });
  }
  return redirect(`/contacts/${params.contactId}`);
}

export async function loader({ params }: Route.LoaderArgs) {
  //const contact = await getContact(params.contactId);
  const url = `/contacts/${params.contactId}/`;
  const res = await fetchData<TContact>(null, url);

  if (res.status === "error") {
    throw new Response("Not found", { status: 404 });
  }
  const contact = res.data;
  return { contact };
}

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;
  const navigate = useNavigate();

  return (
    <Form key={contact.pub_id} id="contact-form" method="post">
      <label>
        <span>Full Name</span>
        <input
          aria-label="Full Name"
          defaultValue={contact.fn}
          name="fn"
          placeholder="Full Name"
          type="text"
        />
      </label>
      <label>
        <span>Non Latin</span>
        <input
          aria-label="Last name"
          defaultValue={contact.non_latin_fn}
          name="non_latin_fn"
          placeholder="Non Latin Full Name e.g: 山田太郎"
          type="text"
        />
      </label>
      <label>
        <span>X Handle</span>
        <input
          defaultValue={contact.x_handle}
          name="x_handle"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar_url}
          name="avatar_url"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </p>
    </Form>
  );
}
