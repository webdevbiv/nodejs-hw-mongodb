/**
 * Retrieves an environment variable or throws an error if not defined and no default provided.
 *
 * @param {string} name - The name of the environment variable.
 * @param {string} [defaultValue] - The fallback value if the environment variable is not set.
 * @returns {string} The environment variable value or the default.
 * @throws {Error} If neither the environment variable nor the default value is set.
 */

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
