export const selectPostizPostsData = (state) => state.postizPosts.data;
export const selectPostizPostsIsFetching = (state) => state.postizPosts.isFetching;
export const selectPostizPostsError = (state) => state.postizPosts.error;

export default {
  selectPostizPostsData,
  selectPostizPostsIsFetching,
  selectPostizPostsError,
};
