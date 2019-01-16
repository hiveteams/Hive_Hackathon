import ApiHelpers from "./api-helpers";

export default {
  createUser({ username }, callback = () => {}) {
    ApiHelpers.post({ path: "create-user", data: { username }, callback });
  }
};
