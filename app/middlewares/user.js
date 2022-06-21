import jwt from "jsonwebtoken";
import crypto from "crypto";
import {} from "dotenv/config";

//LOGIN

/**
 * Generate JWT token
 * @param {*} user the User table record
 */
const tokenOptions = {};
tokenOptions.expiresIn = parseInt(process.env.TOKEN_EXPIRY, 10);

const generateToken = (pseudo) => {
  return jwt.sign(
    {
      pseudo: pseudo,
    },
    process.env.JWT_SECRET,
    tokenOptions
  );
};
export default generateToken;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("token", token);
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, tokenSecret);
    return next();
  } catch (err) {
    return res.status(403).send("Token has expired");
  }
};

//LOGON

/**
 * Validate email format
 * @param {string} email the email to check
 */
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate User data
 * @param {*} User the User Object to check
 */
const validateUserData = (user) => {
  const { pseudo, email, pwd } = user;
  if (pseudo.length === 0) return { status: 401, message: "Set Valid Login" };
  if (pwd.length === 0) return { status: 401, message: "Set Valid Password" };
  if (!validateEmail(email)) return { status: 401, message: "Set Valid Email" };

  return true;
};

/**
 * Hash password
 * @param {string} password the password to hash
 */
const hashPassword = (password) => {
  return crypto
    .createHash("sha256")
    .update(process.env.PWD_SALT)
    .update(password)
    .digest("hex");
};

export { verifyToken, validateUserData, hashPassword };
