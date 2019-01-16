const methods = {};

const registerMethod = ({ method, callback }) => {
  if (methods[method]) {
    throw new Error("Duplicate method name registered");
  }

  methods[method] = callback;
};

const callMethod = async ({ socket, method, userId, data }) => {
  const methodFunction = methods[method];
  if (!methodFunction) {
    throw new Error("Method could not be found");
  }

  return await methodFunction({ socket, userId }, data);
};

module.exports = {
  registerMethod,
  callMethod
};
