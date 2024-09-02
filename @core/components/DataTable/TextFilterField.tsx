import React from 'react';
import {TextField} from '@mui/material';
import * as _ from 'lodash';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';

interface TextFilterFieldProps {
  id: string;
  label?: string | MessageFormatElement[];
  filterKey?: string;
  value?: any;
  onChange: (key: string, value: string) => void;
}

const TextFilterField = ({
  id,
  label,
  value,
  filterKey,
  onChange: onChangeCallback,
}: TextFilterFieldProps) => {
  return (
    <TextField
      variant={'outlined'}
      size={'small'}
      className={'filterTextField'}
      label={label ?? ''}
      id={id}
      defaultValue={value ?? ''}
      onChange={_.debounce(
        (event) =>
          onChangeCallback(filterKey ? filterKey : id, event.target.value),
        500,
      )}
    />
  );
};

export default TextFilterField;
