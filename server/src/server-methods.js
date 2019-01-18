const methods = {};

/**
 * Registers a new server method
 * @param {Object} obj
 * @param {String} obj.method - name of new method to register
 * @param {Function} obj.callback - function to be called for this method
 */
const registerMethod = ({ method, callback }) => {
  if (methods[method]) {
    throw new Error("Duplicate method name registered");
  }

  methods[method] = callback;
};

/**
 * Calls a server method
 * @param {Object} obj
 * @param {Object} obj.socket - socket for the current connection
 * @param {String} obj.method - name of method being called
 * @param {String} obj.userId - userId of the user connected
 * @param {Object} obj.data - data to be passed to the server method
 */
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
