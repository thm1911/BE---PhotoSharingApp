const { createHash } = require("crypto");

const sha256 = (data) => {
  return createHash("sha256").update(data).digest("hex");
};

const hashPassword = (password) => sha256(password);

const comparePassword = (password, hashedPassword) => {
  const hashedInput = sha256(password);
  return hashedInput === hashedPassword;
};

module.exports = {
  hashPassword,
  comparePassword
};
