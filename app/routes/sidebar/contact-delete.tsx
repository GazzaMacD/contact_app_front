import { redirect } from "react-router";
import type { Route } from "../../routes/sidebar/+types/contact-delete";
import { deleteContact } from "../../data";
import type { TContact } from "../../common/types";
import { fetchData } from "../../common/utils.server";

export async function action({ params }: Route.ActionArgs) {
  const url = `/contacts/${params.contactId}/`;
  await fetchData<TContact, null>(null, url, {
    method: "DELETE",
  });
  return redirect("/");
}
export async function loader() {
  return redirect("/");
}
