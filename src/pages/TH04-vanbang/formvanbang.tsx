import React from 'react';
import { Input, InputNumber, DatePicker } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';

export interface FormVanBangField {
  name: string;
  type: 'string' | 'number' | 'date';
}

interface Props {
  field: FormVanBangField;
  value?: string | number | Moment;
  onChange?: (val: any) => void;
}

const FormVanBang: React.FC<Props> = ({ field, value, onChange }) => {
  switch (field.type) {
    case 'number':
      return <InputNumber style={{ width: '100%' }} value={value as number} onChange={onChange} />;
    case 'date':
      return (
        <DatePicker
          style={{ width: '100%' }}
          value={value ? moment(value) : undefined}
          onChange={onChange}
        />
      );
    default:
      return <Input value={value as string} onChange={onChange} />;
  }
};

export default FormVanBang;