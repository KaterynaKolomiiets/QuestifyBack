const UserModel = require("../../models/auth/userModel");
const TokenModel = require("../../models/auth/tokenModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const tokenService = require("./tokenService");
const UserDto = require("../../dtos/user-dto");
const ApiError = require("../auth/apiError");
const jwt = require("jsonwebtoken");
const {
  confirmEmail,
  forgotPasswordEmail,
  checkNewHostEmail,
} = require("./mailService");

class UserService {
  async registration(name, email, password, host) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.Conflict(`Email ${email} in use!`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf
    console.log("host", host);

    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
      activationLink,
      host,
    });

    const mail = confirmEmail(
      `${process.env.API_URL}/api/users/activate/${activationLink}`,
      name
    );

    const msg = {
      to: email,
      from: "maintenance.questify@gmail.com",
      subject: "Please, confirm Your Email!",
      text: `Here is Your verification link - ${process.env.API_URL}/api/users/activate/${activationLink}`,
      html: mail,
    };

    await sgMail.send(msg);

    // const userDto = new UserDto(user); // id, email, isActivated
    // const tokens = tokenService.generateTokens({ ...userDto });
    // await tokenService.saveToken(userDto.id, tokens.refreshToken);
    const newUser = await UserModel.findOne({ email });

    return {
      name: newUser.name,
      email: newUser.email,
      id: newUser.id,
      isActivated: user.isActivated,
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest("Wrong activation link!");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password, host) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.Forbidden(`User with email ${email} not found!`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.Forbidden("Wrong password!");
    }

    if (!user.isActivated) {
      throw ApiError.Forbidden("Not activated account!");
    }

    if (user.host.length && !user.host.includes(host)) {
      user.tmpHost = host;
      await user.save();

      const confirm = jwt.sign(
        `${email}-confirm`,
        process.env.CONFIRM_HOST_SECRET
      );

      const decline = jwt.sign(
        `${email}-decline`,
        process.env.CONFIRM_HOST_SECRET
      );

      const mail = checkNewHostEmail(
        `${process.env.API_URL}/api/users/confirm-new-host/${confirm}`,
        `${process.env.API_URL}/api/users/confirm-new-host/${decline}`
      );

      const msg = {
        to: email,
        from: "maintenance.questify@gmail.com",
        subject: "New IP!",
        text: `We detected autorize in your account from new IP. <a href="${process.env.API_URL}/api/users/confirm-new-host/${confirm}">It was Me!</a> or <a href="${process.env.API_URL}/api/users/confirm-new-host/${decline}">I didn't autorize, logout and change password!</a>`,
        html: mail,
      };

      await sgMail.send(msg);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    console.log("tokens", tokens);

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    console.log("refreshToken", refreshToken);
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async resetPasswordRequest(email) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with email: ${email} not found!`);
    }
    const resetLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf
    user.resetLink = resetLink;
    await user.save();

    const mail = forgotPasswordEmail(
      `${process.env.CLIENT_URL}/api/users/change-password/${resetLink}`,
      user.name
    );

    const msg = {
      to: email,
      from: "maintenance.questify@gmail.com",
      subject: "Reset Password!",
      text: `Here is Your verification link - ${process.env.CLIENT_URL}/api/users/change-password/${resetLink}`,
      html: mail,
    };

    await sgMail.send(msg);
    return resetLink;
  }

  async changePassword(password, resetLink) {
    const user = await UserModel.findOne({ resetLink });
    if (!user) {
      throw ApiError.BadRequest("User not found!");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.resetLink = null;
    await user.save();
  }

  async confirmNewHost(link) {
    const confirmation = jwt.decode(link, process.env.AGREE_SECRET);
    const email = confirmation.split("-")[0];
    const answer = confirmation.split("-")[1];
    console.log("email", email);

    const user = await UserModel.findOne({ email });
    console.log("user", user);

    if (answer === "decline") {
      console.log("user.id", user.id);
      const tokenFromDB = await TokenModel.findOne({ user: user.id });
      console.log("fitokenFromDBrst", tokenFromDB);
      tokenFromDB ? await this.logout(tokenFromDB.refreshToken) : false;
      user.tmpHost = null;
      const resetLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf
      user.resetLink = resetLink;
      await user.save();
      return resetLink;
    }
    user.host.push(user.tmpHost);
    user.tmpHost = null;
    user.save();
    return null;
  }
}

module.exports = new UserService();
