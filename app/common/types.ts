/**
 * Contacts
 */
export type TContact = {
  pub_id: string;
  fn: string;
  non_latin_fn: string;
  favorite: boolean;
  x_handle: string;
  avatar_url: string;
  notes: string;
};

export type TContacts = TContact[];
