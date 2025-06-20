export const selectMarketingCards = (state) => state.marketing.data.cards;
export const selectMarketingPagination = (state) => state.marketing.data.pagination;
export const selectMarketingIsFetching = (state) => state.marketing.isFetching;
export const selectMarketingError = (state) => state.marketing.error;

export default {
  selectMarketingCards,
  selectMarketingPagination,
  selectMarketingIsFetching,
  selectMarketingError,
};
