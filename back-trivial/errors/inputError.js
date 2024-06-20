/**
 * Error class for handling input validation errors.
 * @extends Error
 */
class InputError extends Error {
    /**
     * Constructs an instance of InputError.
     * @param {string} field - The field associated with the error.
     * @param {string} msg - The error message.
     */
    constructor(field, msg) {
      super(msg);
      this.msg = msg; 
      this.field = field;
      this.code = 400;
    }
  }

module.exports = InputError;