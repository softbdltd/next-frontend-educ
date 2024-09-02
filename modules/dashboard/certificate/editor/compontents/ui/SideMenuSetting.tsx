import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {Tooltip} from '@mui/material';
import React from 'react';
import classNames from '../../utils/className';

interface Props extends React.HTMLAttributes<HTMLElement> {
  label?: React.ReactNode;
  htmlFor?: string;
  noLabel?: boolean;
  deleted?: boolean;
  onDelete?: () => void;
  onCreate?: () => void;
}

const SideMenuSetting = ({
  label = '',
  noLabel,
  htmlFor,
  className,
  children,
  onDelete,
  onCreate,
  deleted,
  ...rest
}: Props) => {
  const contents = (
    <>
      <div className='side-menu-setting-content'>
        <span className='side-menu-setting-label'>{label}</span>
        {deleted
          ? onCreate && (
              <Tooltip title='Enable' sx={{display: 'flex'}} arrow>
                <span onClick={onCreate}>
                  <AddIcon />
                </span>
              </Tooltip>
            )
          : onDelete && (
              <Tooltip title={'Disable'} sx={{display: 'flex'}} arrow>
                <span onClick={onDelete}>
                  <RemoveIcon />
                </span>
              </Tooltip>
            )}
      </div>
      {!deleted && children}
    </>
  );

  return noLabel ? (
    <div
      className={classNames('side-menu-setting-container', className)}
      {...rest}>
      {contents}
    </div>
  ) : (
    <label
      htmlFor={htmlFor}
      className={classNames('side-menu-setting-container', className)}
      {...rest}>
      {contents}
    </label>
  );
};

export default SideMenuSetting;
