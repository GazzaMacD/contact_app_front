import { redirect } from "react-router";
import type { Route } from "../../routes/sidebar/+types/contact-delete";
import { deleteContact } from "../../data";

export async function action({ params }: Route.ActionArgs) {
  await deleteContact(params.contactId);
  return redirect("/");
}
export async function loader() {
  return redirect("/");
}
