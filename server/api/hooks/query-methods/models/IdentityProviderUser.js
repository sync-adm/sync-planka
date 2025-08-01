const createOne = (values) => IdentityProviderUser.create({ ...values }).fetch();

const getOneByIssuerAndSub = (issuer, sub) =>
  IdentityProviderUser.findOne({
    issuer,
    sub,
  });

// eslint-disable-next-line no-underscore-dangle
const delete_ = (criteria) => IdentityProviderUser.destroy(criteria).fetch();

module.exports = {
  createOne,
  getOneByIssuerAndSub,
  delete: delete_,
};
