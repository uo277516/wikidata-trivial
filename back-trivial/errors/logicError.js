/**
 * Error class for handling logic errors.
 * @extends Error
 */
class LogicError extends Error {
    /**
     * Constructs an instance of LogicError.
     * @param {string} msg - The error message.
    */
    constructor(msg) {
      super(msg);
      this.msg = msg; 
      this.code = 500;
    }
  }

module.exports = LogicError;