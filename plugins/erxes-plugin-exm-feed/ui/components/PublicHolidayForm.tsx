import React, { useState } from 'react';
import { Form, Uploader } from 'erxes-ui';
import DateControl from 'erxes-ui/lib/components/form/DateControl';
import { IFormProps, IButtonMutateProps } from 'erxes-ui/lib/types';
import { UploadItems } from '../styles';
import { description, title } from '../utils';
import ControlLabel from 'erxes-ui/lib/components/form/Label';
import GenerateFields from './GenerateFields';

type Props = {
  renderButton: (props: IButtonMutateProps) => any;
  item?: any;
  closeModal?: () => void;
  fields: any[];
};

export default function PublicHolidayForm(props: Props) {
  const item = props.item || {};
  const fields = props.fields;

  const [images, setImage] = useState(item.images || []);
  const [createdAt, setCreatedAt] = useState(item.createdAt);
  const [customFieldsData, setCustomFieldsData] = useState(
    item.customFieldsData || []
  );

  const renderContent = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;
    const { renderButton, closeModal } = props;

    return (
      <>
        {title(formProps, item)}
        {description(formProps, item)}
        <DateControl
          value={createdAt}
          required={false}
          name='createdAt'
          onChange={date => setCreatedAt(date)}
          placeholder={'Date'}
          dateFormat={'YYYY-MM-DD HH:mm:ss'}
          timeFormat={true}
        />
        <GenerateFields
          fields={fields}
          customFieldsData={customFieldsData}
          setCustomFieldsData={setCustomFieldsData}
        />
        <UploadItems>
          <div>
            <Uploader defaultFileList={images || []} onChange={setImage} />
            <ControlLabel>Add image:</ControlLabel>
          </div>
        </UploadItems>
        {renderButton({
          values: {
            title: values.title,
            description: values.description ? values.description : null,
            contentType: 'publicHoliday',
            images,
            createdAt,
            customFieldsData
          },
          isSubmitted,
          callback: closeModal
        })}
      </>
    );
  };

  return <Form renderContent={renderContent} />;
}
