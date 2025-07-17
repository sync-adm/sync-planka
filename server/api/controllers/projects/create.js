module.exports = {
  inputs: {
    type: {
      type: 'string',
      isIn: Object.values(Project.Types),
      required: true,
    },
    name: {
      type: 'string',
      maxLength: 128,
      required: true,
    },
    description: {
      type: 'string',
      isNotEmptyString: true,
      maxLength: 1024,
      allowNull: true,
    },
    subdomain: {
      type: 'string',
      isNotEmptyString: true,
      maxLength: 8,
      allowNull: true,
      required: false,
    },
    domain: {
      type: 'string',
      required: true,
      description: 'Domínio personalizado do site',
    },
    integrationType: {
      type: 'string',
      isIn: ['Sync', 'Boom Sistemas'],
      required: true,
      description: 'Tipo de integração',
    },
  },

  async fn(inputs) {
    const { currentUser } = this.req;

    const values = _.pick(inputs, [
      'type',
      'name',
      'description',
      'subdomain',
      'domain',
      'integrationType',
    ]);

    const { project, projectManager } = await sails.helpers.projects.createOne.with({
      values,
      actorUser: currentUser,
      request: this.req,
    });

    return {
      item: project,
      included: {
        projectManagers: [projectManager],
      },
    };
  },
};
