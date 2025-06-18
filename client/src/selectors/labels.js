import { createSelector } from 'redux-orm';

import orm from '../orm';
import { isLocalId } from '../utils/local-id';

export const makeSelectLabelById = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ Label }, id) => {
      const labelModel = Label.withId(id);

      if (!labelModel) {
        return labelModel;
      }

      return {
        ...labelModel.ref,
        isPersisted: !isLocalId(labelModel.id),
      };
    },
  );

export const selectLabelById = makeSelectLabelById();

export default {
  makeSelectLabelById,
  selectLabelById,
};
