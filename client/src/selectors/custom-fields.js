import { createSelector } from 'redux-orm';

import orm from '../orm';
import { isLocalId } from '../utils/local-id';

export const makeSelectCustomFieldById = () =>
  createSelector(
    orm,
    (_, id) => id,
    ({ CustomField }, id) => {
      const customFieldModel = CustomField.withId(id);

      if (!customFieldModel) {
        return customFieldModel;
      }

      return {
        ...customFieldModel.ref,
        isPersisted: !isLocalId(customFieldModel.id),
      };
    },
  );

export const selectCustomFieldById = makeSelectCustomFieldById();

export default {
  makeSelectCustomFieldById,
  selectCustomFieldById,
};
