"use strict";

let error = "";

function ValidationContract() {
  error = "";
}

ValidationContract.prototype.isRequired = (value, message) => {
  if (!value || value.length <= 0) error = message;
};

ValidationContract.prototype.hasMinLen = (value, min, message) => {
  if (!value || value.length < min) error = message;
};

ValidationContract.prototype.hasMaxLen = (value, max, message) => {
  if (!value || value.length > max) error = message;
};

ValidationContract.prototype.isFixedLen = (value, len, message) => {
  if (value.length != len) error = message;
};

ValidationContract.prototype.isEmail = (value, message) => {
  var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
  if (!reg.test(value)) error = message;
};

ValidationContract.prototype.errors = () => {
  return error;
};

ValidationContract.prototype.clear = () => {
  error = "";
};

ValidationContract.prototype.isValid = () => {
  return error.length == 0;
};

module.exports = ValidationContract;
