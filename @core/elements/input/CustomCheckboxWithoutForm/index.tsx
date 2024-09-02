import {Checkbox, FormControlLabel} from '@mui/material';
import Typography from '@mui/material/Typography';
import {MessageFormatElement} from 'react-intl';

type Props = {
  id: string;
  label: string | number | MessageFormatElement[];
  isLoading?: boolean;
  isDisabled?: boolean;
  errorInstance?: any;
  checked: boolean | undefined;
  onChange: (event?: any) => void;
  typographyProps?: any;
};

const CustomCheckboxWithoutForm = ({
  id,
  label,
  isDisabled = false,
  errorInstance,
  checked,
  onChange,
  typographyProps = {},
}: Props) => {
  return (
    <Typography
      color={errorInstance?.[id] ? 'error' : 'inherit'}
      {...typographyProps}>
      <FormControlLabel
        sx={{
          marginLeft: '0',
        }}
        tabIndex={0}
        control={
          <Checkbox
            color='primary'
            checked={checked}
            onChange={onChange}
            disabled={isDisabled}
            style={{padding: '2px', marginRight: 5}}
          />
        }
        label={label as string}
        title={label as string}
      />
    </Typography>
  );
};

export default CustomCheckboxWithoutForm;
