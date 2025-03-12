import { Form, redirect, useNavigate } from "react-router";

import type { Route } from "../../routes/sidebar/+types/contact-edit";
import { getContact, updateContact } from "../../data";
import type { TContact, TContactErrors } from "../../common/types";
import { fetchData } from "../../common/utils.server";
import { ERROR_MSGS } from "../../common/error_messages";

type TContactEditFormErrors = TContactErrors & {
  non_field_errors?: string[];
};

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  // currently no validation yet, use zod
  //const updates = Object.fromEntries(formData);
  const url = `/contacts/${params.contactId}/`;
  const res = await fetchData<TContact, TContactEditFormErrors>(null, url, {
    method: "PATCH",
    body: formData,
  });
  if (!res.success) {
    if (res.status === 500 || !res.data) {
      return {
        non_field_errors: [
          "Sorry there seems to be a problem. Please try again.",
        ],
      };
    }
    return res.data;
  }
  return redirect(`/contacts/${params.contactId}`);
}

export async function loader({ params }: Route.LoaderArgs) {
  //const contact = await getContact(params.contactId);
  const url = `/contacts/${params.contactId}/`;
  const res = await fetchData<TContact, null>(null, url);

  if (!res.success) {
    // to be caught by the nearest error boundary
    throw new Response(ERROR_MSGS[res.status].msg, { status: res.status });
  }
  const contact = res.data;
  return { contact };
}

export default function EditContact({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { contact } = loaderData;
  const navigate = useNavigate();

  return (
    <Form
      key={contact.pub_id}
      id="contact-form"
      method="post"
      encType="multipart/form-data"
    >
      {actionData?.non_field_errors ? (
        <ul>
          {actionData.non_field_errors.map((e) => (
            <li>{e}</li>
          ))}
        </ul>
      ) : null}
      <label>
        <span>Full Name</span>
        <input
          aria-label="Full Name"
          defaultValue={contact.fn}
          name="fn"
          placeholder="Full Name"
          type="text"
          aria-invalid={Boolean(actionData?.fn?.length)}
          aria-errormessage={actionData?.fn?.length ? "fn-errors" : undefined}
        />
        {actionData?.fn?.length ? (
          <ul role="alert" id="fn-errors">
            {actionData.fn.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
      </label>
      <label>
        <span>Non Latin</span>
        <input
          aria-label="Last name"
          defaultValue={contact.non_latin_fn}
          name="non_latin_fn"
          placeholder="Non Latin Full Name e.g: 山田太郎"
          type="text"
          aria-invalid={Boolean(actionData?.non_latin_fn?.length)}
          aria-errormessage={
            actionData?.non_latin_fn?.length ? "non_latin_fn-errors" : undefined
          }
        />
        {actionData?.non_latin_fn?.length ? (
          <ul role="alert" id="non_latin_fn-errors">
            {actionData.non_latin_fn.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
      </label>
      <label>
        <span>X Handle</span>
        <input
          defaultValue={contact.x_handle}
          name="x_handle"
          placeholder="@jack"
          aria-invalid={Boolean(actionData?.x_handle?.length)}
          aria-errormessage={
            actionData?.x_handle?.length ? "x_handle-errors" : undefined
          }
        />
        {actionData?.x_handle?.length ? (
          <ul role="alert" id="x_handle-errors">
            {actionData.x_handle.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
      </label>
      <label>
        <span>Profile Image</span>
        <input
          name="profile_image"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          aria-invalid={Boolean(actionData?.profile_image?.length)}
          aria-errormessage={
            actionData?.profile_image?.length
              ? "profile_image-errors"
              : undefined
          }
        />
        {actionData?.profile_image?.length ? (
          <ul role="alert" id="profile_image-errors">
            {actionData.profile_image.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar_url}
          name="avatar_url"
          placeholder="https://example.com/avatar.jpg"
          type="text"
          aria-invalid={Boolean(actionData?.avatar_url?.length)}
          aria-errormessage={
            actionData?.avatar_url?.length ? "avatar_url-errors" : undefined
          }
        />
        {actionData?.avatar_url?.length ? (
          <ul role="alert" id="avatar_url-errors">
            {actionData.avatar_url.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
          aria-invalid={Boolean(actionData?.notes?.length)}
          aria-errormessage={
            actionData?.notes?.length ? "notes-errors" : undefined
          }
        />
        {actionData?.notes?.length ? (
          <ul role="alert" id="notes-errors">
            {actionData.notes.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
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
