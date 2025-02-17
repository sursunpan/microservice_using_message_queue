const { ValidateSignature } = require("../../utlis");

module.exports = async (req, res, next) => {
  const isAuthorized = await ValidateSignature(req);
  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: "Not Authorize" });
};
