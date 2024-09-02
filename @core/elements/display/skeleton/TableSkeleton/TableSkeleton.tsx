import {Skeleton, Table, TableBody, TableCell, TableRow} from '@mui/material';
import React from 'react';
import {range} from '../../../../utilities/helpers';

type Props = {
  columnNumbers: number;
  rowSize: number;
};

const TableSkeleton = ({columnNumbers, rowSize = 1}: Props) => {
  const rows = range(rowSize, 1);

  return (
    <Table>
      <TableBody>
        <TableRow key={1}>
          <TableCell colSpan={columnNumbers}>
            {rows.map((item) => (
              <Skeleton key={item} variant='text' width={'100%'} height={50} />
            ))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default React.memo(TableSkeleton);
