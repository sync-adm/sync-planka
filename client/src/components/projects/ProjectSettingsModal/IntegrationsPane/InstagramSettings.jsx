import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Form, Header, Checkbox, Popup, Icon } from 'semantic-ui-react';

import VariableButtons from './VariableButtons';
import styles from './InstagramSettings.module.scss';

function InstagramSettings({
  data,
  onCheckboxChange,
  onIntegrationChange,
  descriptionRef,
  onInsertVariable,
}) {
  const [t] = useTranslation();

  return (
    <div className={styles.container}>
      <Header as="h6">{t('common.automaticPublishingSettings')}</Header>
      <Form.Field>
        <Checkbox
          name="enableFeed"
          label={t('common.enableFeedPosts')}
          checked={data.enableFeed}
          onChange={onCheckboxChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          name="enableReels"
          label={t('common.enableReelsPosts')}
          checked={data.enableReels}
          onChange={onCheckboxChange}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          name="enableStory"
          label={t('common.enableStoryPosts')}
          checked={data.enableStory}
          onChange={onCheckboxChange}
        />
      </Form.Field>
      <Form.Field className={styles.fieldContainer}>
        <div className={styles.labelContainer}>
          <label htmlFor="defaultDescription">{t('common.defaultPostDescription')}</label>
          <Popup
            trigger={<Icon name="info circle" className={styles.helpIcon} />}
            content={t('common.defaultPostDescriptionHelper')}
            on="hover"
            position="top center"
            size="small"
          />
        </div>

        <VariableButtons onInsertVariable={onInsertVariable} />

        <textarea
          ref={descriptionRef}
          id="defaultDescription"
          name="defaultDescription"
          value={data.defaultDescription}
          onChange={(e) =>
            onIntegrationChange(e, {
              name: 'defaultDescription',
              value: e.target.value,
            })
          }
          placeholder={t('common.defaultPostDescriptionPlaceholder')}
          rows={3}
          className={styles.defaultDescriptionField}
        />
        <small className={styles.helpText}>{t('common.defaultPostDescriptionHelper')}</small>
      </Form.Field>
    </div>
  );
}

InstagramSettings.propTypes = {
  data: PropTypes.shape({
    enableFeed: PropTypes.bool,
    enableReels: PropTypes.bool,
    enableStory: PropTypes.bool,
    defaultDescription: PropTypes.string,
  }).isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func.isRequired,
  descriptionRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  onInsertVariable: PropTypes.func.isRequired,
};

export default InstagramSettings;
