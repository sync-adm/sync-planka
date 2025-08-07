import ActionTypes from '../constants/ActionTypes';

const fetchPostizPosts = (projectId, provider) => ({
  type: ActionTypes.POSTIZ_POSTS_FETCH,
  payload: {
    projectId,
    provider,
  },
});

fetchPostizPosts.success = (postizPosts) => ({
  type: ActionTypes.POSTIZ_POSTS_FETCH__SUCCESS,
  payload: {
    postizPosts,
  },
});

fetchPostizPosts.failure = (error) => ({
  type: ActionTypes.POSTIZ_POSTS_FETCH__FAILURE,
  payload: {
    error,
  },
});

const clearPostizPostsError = () => ({
  type: ActionTypes.POSTIZ_POSTS_ERROR_CLEAR,
});

export default {
  fetchPostizPosts,
  clearPostizPostsError,
};
