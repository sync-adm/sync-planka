import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Header, Checkbox, Popup, Icon } from 'semantic-ui-react';

import VariableButtons from './VariableButtons';

function InstagramSettings({
  data,
  onCheckboxChange,
  onIntegrationChange,
  descriptionRef,
  onInsertVariable,
}) {
  const [t] = useTranslation();

  return (
    <div style={{ marginTop: '15px' }}>
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
      <Form.Field style={{ marginTop: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <label htmlFor="defaultDescription">{t('common.defaultPostDescription')}</label>
          <Popup
            trigger={
              <Icon
                name="info circle"
                style={{ marginLeft: '5px', cursor: 'help', color: '#2185d0' }}
              />
            }
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
          style={{
            width: '100%',
            padding: '9px 14px',
            fontSize: '1em',
            border: '1px solid rgba(34,36,38,.15)',
            borderRadius: '.28571429rem',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: '1.21428571em',
            transition: 'border-color 0.1s ease, box-shadow 0.1s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#85b7d9';
            e.target.style.boxShadow = '0 2px 3px 0 rgba(34,36,38,.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(34,36,38,.15)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <small style={{ color: '#666', fontSize: '0.85em' }}>
          {t('common.defaultPostDescriptionHelper')}
        </small>
      </Form.Field>
    </div>
  );
}

export default InstagramSettings;
