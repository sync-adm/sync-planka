module.exports = {
  friendlyName: 'Marketing utilities',

  description: 'Helper functions for marketing and design routes',

  inputs: {
    listNameContains: {
      type: 'string',
      required: true,
      description: 'Substring to search for in list names',
    },
    page: {
      type: 'number',
      defaultsTo: 1,
      description: 'Page number for pagination',
    },
    limit: {
      type: 'number',
      defaultsTo: 20,
      description: 'Number of items per page',
    },
    includeAllFields: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Whether to include all fields in the response',
    },
  },

  exits: {
    success: {
      description: 'Cards retrieved successfully',
    },
    invalidInput: {
      description: 'Invalid input provided',
      responseType: 'badRequest',
    },
  },

  async fn(options = {}) {
    const { listNameContains, page = 1, limit = 20, includeAllFields = false } = options;

    if (!listNameContains) {
      throw new Error('listNameContains é obrigatório');
    }

    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.max(1, Math.min(100, limit));
    const skip = (normalizedPage - 1) * normalizedLimit;

    const listSelect = includeAllFields ? undefined : ['id', 'name', 'boardId', 'position'];
    const boardSelect = includeAllFields ? undefined : ['id', 'name', 'projectId'];
    const projectSelect = includeAllFields ? undefined : ['id', 'name'];

    const matchingLists = await List.find({
      where: { name: { like: `%${listNameContains}%` } },
      select: listSelect,
    });

    const listIds = matchingLists.map((list) => list.id);
    if (listIds.length === 0) {
      return {
        cards: [],
        pagination: {
          page: normalizedPage,
          limit: normalizedLimit,
          totalRecords: 0,
          totalPages: 0,
          hasMore: false,
        },
      };
    }

    const totalCards = await Card.count({
      where: { listId: { in: listIds } },
    });

    const cards = await Card.find({
      where: { listId: { in: listIds } },
      skip,
      limit: normalizedLimit,
      sort: 'createdAt ASC',
    });

    const boardIds = [...new Set(matchingLists.map((list) => list.boardId))];
    const boards = await Board.find({
      where: { id: { in: boardIds } },
      select: boardSelect,
    });

    const projectIds = [...new Set(boards.map((board) => board.projectId))];
    const projects = await Project.find({
      where: { id: { in: projectIds } },
      select: projectSelect,
    });

    const listMap = {};
    for (let i = 0; i < matchingLists.length; i += 1) {
      const l = matchingLists[i];
      listMap[l.id] = l;
    }

    const boardMap = {};
    for (let i = 0; i < boards.length; i += 1) {
      const b = boards[i];
      boardMap[b.id] = b;
    }

    const projectMap = {};
    for (let i = 0; i < projects.length; i += 1) {
      const p = projects[i];
      projectMap[p.id] = p;
    }

    const formattedCards = cards.map((card) => {
      const list = listMap[card.listId] || {};
      const board = boardMap[list.boardId] || {};
      const project = projectMap[board.projectId] || {};

      if (includeAllFields) {
        return {
          ...card,
          list: {
            ...list,
            board: {
              ...board,
              project: {
                ...project,
              },
            },
          },
        };
      }

      return {
        id: card.id,
        name: card.name,
        description: card.description,
        position: card.position,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt,

        list: {
          id: list.id,
          name: list.name,
          position: list.position,

          board: {
            id: board.id,
            name: board.name,

            project: {
              id: project.id,
              name: project.name,
            },
          },
        },
      };
    });

    return {
      cards: formattedCards,
      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        totalRecords: totalCards,
        totalPages: Math.ceil(totalCards / normalizedLimit),
        hasMore: normalizedPage < Math.ceil(totalCards / normalizedLimit),
      },
    };
  },
};
