export const selectMarketingCards = (state) => state.marketing.data.cards;
export const selectMarketingPagination = (state) => state.marketing.data.pagination;
export const selectMarketingIsFetching = (state) => state.marketing.isFetching;
export const selectMarketingError = (state) => state.marketing.error;

export const selectEvolutionGroups = (state) => state.marketing.evolutionGroups.data;
export const selectEvolutionGroupsIsFetching = (state) =>
  state.marketing.evolutionGroups.isFetching;
export const selectEvolutionGroupsError = (state) => state.marketing.evolutionGroups.error;

export default {
  selectMarketingCards,
  selectMarketingPagination,
  selectMarketingIsFetching,
  selectMarketingError,
  selectEvolutionGroups,
  selectEvolutionGroupsIsFetching,
  selectEvolutionGroupsError,
};
