import generateToken, {
  validateUserData,
  hashPassword,
} from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/middlewares/user.js";
import {} from "dotenv/config";
import jwt from "jsonwebtoken";
import User from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/db/models/User.js";

// Login user
const logAPerson = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        pseudo: req.body.pseudo,
      },
      raw: true,
    });
    if (!user || user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.password !== hashPassword(req.body.password)) {
      console.log("userdansifpassword", user);
      return res.status(401).send({ message: "Wrong Password" });
    }

    const token = generateToken(user);
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Validate a token
const checkAToken = (req, res) => {
  try {
    // Decode token
    jwt.verify(req.body.token, process.env.JWT_SECRET);
    return res.status(200).send({ expired: false });
  } catch (err) {
    return res.status(200).send({ expired: true });
  }
};

// Create new user and return token
const createNewUser = (req, res) => {
  const { pseudo, email, password } = req.body;
  const mail = email;
  const pwd = password;
  const newBody = { pseudo, mail, pwd };

  // Validate input data
  const validUser = validateUserData(newBody);
  if (validUser !== true)
    return res.status(validUser.status).send(validUser.message);
  // Hash user password
  const hash = hashPassword(req.body.password);

  const newUser = { ...newBody, pwd: hash };

  return User.create(newUser)
    .then((user) => res.status(201).send({ user, token: generateToken(user) }))
    .catch((err) => res.status(403).send(err));
};

const logoutAPerson = (req, res) => {
  try {
    if (!req.session) {
      console.log("impossible de déconnecter quelqu'un de connecté");
    } else {
      req.session.destroy();
      res.clearCookie("connect.sid");
      return res.status(200).json("Successful logout");
    }
  } catch (err) {
    res.status(500).json(err.toString());
  }
};

export { logAPerson, checkAToken, logoutAPerson, createNewUser };
