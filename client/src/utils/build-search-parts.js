const SEARCH_PARTS_REGEX = /[ ,;]+/; // TODO: move to utils

export default (search) =>
  search.split(SEARCH_PARTS_REGEX).flatMap((searchPart) => {
    if (!searchPart) {
      return [];
    }

    return searchPart.toLowerCase();
  });
