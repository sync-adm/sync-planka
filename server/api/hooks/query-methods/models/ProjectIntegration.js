module.exports = {
  async getOneByProjectIdAndIntegrationType(projectId, integrationType, criteria = {}) {
    return ProjectIntegration.findOne({
      projectId,
      integrationType,
      ...criteria,
    });
  },

  async getByProjectId(projectId, criteria = {}) {
    return ProjectIntegration.find({
      projectId,
      ...criteria,
    });
  },

  async getOneById(id, criteria = {}) {
    return ProjectIntegration.findOne({
      id,
      ...criteria,
    });
  },
};
