export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Standardized response messages
export const Messages = {
  CONTACTS_FETCHED: 'Successfully found contacts!',
  CONTACT_CREATED: 'Successfully created a contact!',
  CONTACT_UPDATED: 'Successfully patched a contact!',
  INVALID_ID: (id) => `Invalid contact ID: ${id}`,
  CONTACT_NOT_FOUND: (id) => `Contact with ID ${id} not found`,
  CONTACT_FOUND: (id) => `Contact with ID ${id} found`,
};
