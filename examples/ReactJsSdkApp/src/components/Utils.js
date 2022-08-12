export const capitalizeFirstLetter = (value) => {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const convertCamelCaseToText = (value) => {
  if (!value) return "";
  const result = value.replace(/([A-Z])/g, " $1");
  return capitalizeFirstLetter(result);
};
