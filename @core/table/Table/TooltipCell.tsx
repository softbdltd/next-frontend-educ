import {styled} from '@mui/material/styles';
import React, {CSSProperties} from 'react';
import {ICellProps} from '../../../shared/Interface/common.interface';

const Root = styled('div')({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

export const TooltipCell: React.FC<ICellProps<any>> = ({
  cell: {value},
  column: {align = 'left'},
}) => <Tooltip text={value} align={align} />;

interface Tooltip {
  text: string;
  tooltip?: string;
  align: string;
}

export const Tooltip: React.FC<Tooltip> = ({text, tooltip = text, align}) => {
  return (
    <Root style={{textAlign: align} as CSSProperties}>
      <span title={tooltip}>{text}</span>
    </Root>
  );
};
