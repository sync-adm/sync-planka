const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const { isEmailOrUsername } = require('../../../utils/validators');
const { getRemoteAddress } = require('../../../utils/remote-address');

const Errors = {
  INVALID_CREDENTIALS: {
    invalidCredentials: 'Invalid credentials',
  },
  INVALID_EMAIL_OR_USERNAME: {
    invalidEmailOrUsername: 'Invalid email or username',
  },
  INVALID_PASSWORD: {
    invalidPassword: 'Invalid password',
  },
  USE_SINGLE_SIGN_ON: {
    useSingleSignOn: 'Use single sign-on',
  },
};

module.exports = {
  inputs: {
    emailOrUsername: {
      type: 'string',
      maxLength: 256,
      custom: isEmailOrUsername,
      required: true,
    },
    password: {
      type: 'string',
      maxLength: 256,
      required: true,
    },
    withHttpOnlyToken: {
      type: 'boolean',
      defaultsTo: false,
    },
  },

  exits: {
    invalidCredentials: {
      responseType: 'unauthorized',
    },
    invalidEmailOrUsername: {
      responseType: 'unauthorized',
    },
    invalidPassword: {
      responseType: 'unauthorized',
    },
    useSingleSignOn: {
      responseType: 'forbidden',
    },
  },

  async fn(inputs) {
    if (sails.config.custom.oidcEnforced) {
      throw Errors.USE_SINGLE_SIGN_ON;
    }

    const remoteAddress = getRemoteAddress(this.req);
    const user = await User.qm.getOneActiveByEmailOrUsername(inputs.emailOrUsername);

    if (!user) {
      sails.log.warn(
        `Invalid email or username: "${inputs.emailOrUsername}"! (IP: ${remoteAddress})`,
      );

      throw sails.config.custom.showDetailedAuthErrors
        ? Errors.INVALID_EMAIL_OR_USERNAME
        : Errors.INVALID_CREDENTIALS;
    }

    if (user.isSsoUser) {
      throw Errors.USE_SINGLE_SIGN_ON;
    }

    const isPasswordValid = await bcrypt.compare(inputs.password, user.password);

    if (!isPasswordValid) {
      sails.log.warn(`Invalid password! (IP: ${remoteAddress})`);

      throw sails.config.custom.showDetailedAuthErrors
        ? Errors.INVALID_PASSWORD
        : Errors.INVALID_CREDENTIALS;
    }

    const { token: accessToken, payload: accessTokenPayload } = sails.helpers.utils.createJwtToken(
      user.id,
    );

    const httpOnlyToken = inputs.withHttpOnlyToken ? uuid() : null;

    await Session.qm.createOne({
      accessToken,
      httpOnlyToken,
      remoteAddress,
      userId: user.id,
      userAgent: this.req.headers['user-agent'],
    });

    if (httpOnlyToken && !this.req.isSocket) {
      sails.helpers.utils.setHttpOnlyTokenCookie(httpOnlyToken, accessTokenPayload, this.res);
    }

    return {
      item: accessToken,
    };
  },
};
