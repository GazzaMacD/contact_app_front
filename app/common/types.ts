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
  profile_image: string | null;
  notes: string;
};

export type TContactErrors = {
  fn?: string[];
  non_latin_fn?: string[];
  favorite?: string[];
  x_handle?: string[];
  avatar_url?: string[];
  profile_image?: string[];
  notes?: string[];
};

export type TContacts = TContact[];
