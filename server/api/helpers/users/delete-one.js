module.exports = {
  inputs: {
    record: {
      type: 'ref',
      required: true,
    },
    actorUser: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  async fn(inputs) {
    const { projectManagers, boardMemberships } = await sails.helpers.users.deleteRelated(
      inputs.record,
    );

    const user = await User.qm.deleteOne(inputs.record.id);

    if (user) {
      sails.helpers.users.removeRelatedFiles(user);

      const scoper = sails.helpers.users.makeScoper(user);
      scoper.boardMemberships = boardMemberships;

      const privateUserRelatedUserIds = await scoper.getPrivateUserRelatedUserIds();

      privateUserRelatedUserIds.forEach((userId) => {
        sails.sockets.broadcast(
          `user:${userId}`,
          'userDelete',
          {
            // FIXME: hack
            item: sails.helpers.users.presentOne(user, {
              id: userId,
              role: User.Roles.ADMIN,
            }),
          },
          inputs.request,
        );
      });

      const publicUserRelatedUserIds = await scoper.getPublicUserRelatedUserIds();

      publicUserRelatedUserIds.forEach((userId) => {
        sails.sockets.broadcast(
          `user:${userId}`,
          'userDelete',
          {
            // FIXME: hack
            item: sails.helpers.users.presentOne(user, {
              id: userId,
            }),
          },
          inputs.request,
        );
      });

      sails.helpers.utils.sendWebhooks.with({
        event: 'userDelete',
        buildData: () => ({
          item: sails.helpers.users.presentOne(user),
        }),
        user: inputs.actorUser,
      });

      sails.sockets.leaveAll(`@user:${user.id}`);

      const projectIds = await sails.helpers.utils.mapRecords(projectManagers, 'projectId', true);
      const lonelyProjects = await sails.helpers.projects.getLonelyByIds(projectIds);

      await Promise.all(
        lonelyProjects.map((project) =>
          // TODO: optimize with scoper
          sails.helpers.projectManagers.createOne.with({
            values: {
              project,
              user: inputs.actorUser,
            },
            actorUser: inputs.actorUser,
          }),
        ),
      );
    }

    return user;
  },
};
