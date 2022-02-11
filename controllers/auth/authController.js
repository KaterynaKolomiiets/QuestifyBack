const userService = require("../../service/auth/userService");
const ApiError = require("../../service/auth/apiError");

class UserController {
  async registration(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const ip = req.headers.hrmt;
      const host = Buffer.from(ip, "base64").toString();

      const userData = await userService.registration(
        name,
        email,
        password,
        host
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(201).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const ip = req.headers.hrmt;
      const host = Buffer.from(ip, "base64").toString();

      console.log("host", host);
      const userData = await userService.login(email, password, host);
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
      // const { refreshToken } = req.cookies;
      const refreshToken = req.headers.update.slice(
        req.headers.update.indexOf("=") + 1
      );
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "logout success" });
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
      const refreshToken = req.headers.update.slice(
        req.headers.update.indexOf("=") + 1
      );
      // const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const link = await userService.resetPasswordRequest(req.body.email);
      // return res.json({ message: "Please, check your email" });
      return res.redirect(`/`);
    } catch (e) {
      next(e);
    }
  }

  async changePasswordController(req, res, next) {
    try {
      const resetLink = req.params.link;
      const newPassword = await userService.changePassword(
        req.body.password,
        resetLink
      );
      return res.json({ message: "password change successfully" });
    } catch (e) {
      next(e);
    }
  }

  async confirmHost(req, res, next) {
    try {
      const result = await userService.confirmNewHost(req.params.link);
      if (result) {
        console.log("result", result);
        return res.redirect(
          `${process.env.CLIENT_URL}/api/users/change-password/${result}`
        );
      }
      return res.redirect(`${process.env.CLIENT_URL}/auth`);
      // res.json({ message: "IP adress mark as safe!" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
