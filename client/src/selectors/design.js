export const selectDesignCards = (state) => state.design.data.cards;
export const selectDesignPagination = (state) => state.design.data.pagination;
export const selectDesignIsFetching = (state) => state.design.isFetching;
export const selectDesignError = (state) => state.design.error;

export default {
  selectDesignCards,
  selectDesignPagination,
  selectDesignIsFetching,
  selectDesignError,
};
