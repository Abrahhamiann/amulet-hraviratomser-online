export const required = (data, fields) => {
  const errors = {};
  fields.forEach((field) => {
    if (!data[field]) errors[field] = 'Required';
  });
  return errors;
};

export const toForm = (event) => Object.fromEntries(new FormData(event.currentTarget).entries());
