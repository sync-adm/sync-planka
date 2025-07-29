module.exports = {
  friendlyName: 'Get Postiz integrations',

  description: 'Fetch available integrations from Postiz API.',

  inputs: {
    projectId: {
      type: 'string',
      required: true,
      description: 'Project ID to get integration config from',
    },
    actorUser: {
      type: 'ref',
      required: true,
      description: 'User making the request',
    },
  },

  async fn(inputs) {
    const { projectId, actorUser } = inputs;

    const projectManager = await ProjectManager.findOne({
      projectId,
      userId: actorUser.id,
    });

    if (!projectManager) {
      throw new Error('User is not a manager of this project');
    }

    const project = await Project.findOne({ id: projectId });

    if (!project) {
      throw new Error('Project not found');
    }

    const postizBaseUrl = 'https://postiz-marketing.sync.dev.br';
    const postizToken = '9aeb6cd31417e4dd6c2db54d3f206c247ada36228249bc8c502c5a4ca1fd527d';

    try {
      const response = await fetch(`${postizBaseUrl}/api/public/v1/integrations`, {
        method: 'GET',
        headers: {
          Authorization: postizToken,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      sails.log.error('Error fetching Postiz integrations:', error);
      throw new Error(`Failed to fetch integrations from Postiz: ${error.message}`);
    }
  },
};
