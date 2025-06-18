export const selectIsContentFetching = ({ core: { isContentFetching } }) => isContentFetching;

export const selectIsLogouting = ({ core: { isLogouting } }) => isLogouting;

export const selectIsFavoritesEnabled = ({ core: { isFavoritesEnabled } }) => isFavoritesEnabled;

export const selectIsEditModeEnabled = ({ core: { isEditModeEnabled } }) => isEditModeEnabled;

export const selectRecentCardId = ({ core: { recentCardId } }) => recentCardId;

export const selectHomeView = ({ core: { homeView } }) => homeView;

export const selectProjectsSearch = ({ core: { projectsSearch } }) => projectsSearch;

export const selectProjectsOrder = ({ core: { projectsOrder } }) => projectsOrder;

export const selectIsHiddenProjectsVisible = ({ core: { isHiddenProjectsVisible } }) =>
  isHiddenProjectsVisible;

export default {
  selectIsContentFetching,
  selectIsLogouting,
  selectIsFavoritesEnabled,
  selectIsEditModeEnabled,
  selectRecentCardId,
  selectHomeView,
  selectProjectsSearch,
  selectProjectsOrder,
  selectIsHiddenProjectsVisible,
};
