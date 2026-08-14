export const required = (data, fields, message) => {
  const errors = {};
  fields.forEach((field) => {
    if (!data[field]) errors[field] = message;
  });
  return errors;
};

export const toForm = (event) => Object.fromEntries(new FormData(event.currentTarget).entries());
