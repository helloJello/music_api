const HttpStatus = require("http-status-codes");
const authMiddleware = require("../middleware/auth");
const ValidationContract = require("../middleware/validator");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let contract = new ValidationContract();
    contract.isRequired(username, "Username is required!");
    contract.isRequired(password, "Password is required!");

    if (!contract.isValid()) {
      return res
        .status(HttpStatus.StatusCodes.CONFLICT)
        .send(contract.errors());
    }

    if (
      username === process.env.ADMIN_USERNAME &&
      username === process.env.ADMIN_PASSWORD
    ) {
      return res.status(HttpStatus.StatusCodes.NOT_FOUND).send({});
    }

    //Generate the JWT Token
    let token = await authMiddleware.generateToken({
      username: username
    });

    res.status(HttpStatus.StatusCodes.OK).send({ username: username, token });
  } catch (error) {
    res.status(HttpStatus.StatusCodes.BAD_REQUEST).send();
  }
};
