export const getEnv = (name, defaultValue) => {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(
        `Environment variable ${name} is not defined and no default value provided.`,
      );
    }
    return defaultValue;
  }
  return value;
};
