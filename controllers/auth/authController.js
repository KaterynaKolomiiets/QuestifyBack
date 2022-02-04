const userService = require("../../service/auth/userService");
const ApiError = require("../../service/auth/apiError");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json({ message: "logout success" });
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req, res, next) {
    try {
      await userService.resetPasswordRequest(req.body.email);
      // return res.redirect(process.env.CLIENT_URL);
      return res.json({ message: "ok" });
    } catch (e) {
      next(e);
    }
  }

  async changePassword(req, res, next) {
    try {
      const resetLink = req.params.link;
      console.log("resetLink", resetLink);
      const newPassword = await userService.changePassword(
        req.body.password,
        resetLink
      );
      return res.json({ message: "password change successfully" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
