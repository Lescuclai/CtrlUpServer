import express from "express";
// import of the controllers
import {
  checkAToken,
  logAPerson,
  logoutAPerson,
  createNewUser,
} from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/controllers/userController.js";
const router = express.Router();

// Login user
router.post("/login", logAPerson);

// Validate a token
router.post("/check", checkAToken);

// Create new user and return token
router.post("/register", createNewUser);

router.post("/logout", logoutAPerson);

export default router;
