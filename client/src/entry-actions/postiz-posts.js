import EntryActionTypes from '../constants/EntryActionTypes';

const fetchPostizPosts = (projectId, provider) => ({
  type: EntryActionTypes.POSTIZ_POSTS_FETCH,
  payload: {
    projectId,
    provider,
  },
});

const clearPostizPostsError = () => ({
  type: EntryActionTypes.POSTIZ_POSTS_ERROR_CLEAR,
  payload: {},
});

export default {
  fetchPostizPosts,
  clearPostizPostsError,
};
