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
  CONTACT_FOUND: (id) => `Successfully found contact with id ${id}!`,
  CONTACT_NOT_FOUND: (id) => `Contact with ID ${id} not found`,
  INVALID_ID: (id) => `Invalid contact ID: ${id}`,
  NOT_FOUND: 'Not found',
};
