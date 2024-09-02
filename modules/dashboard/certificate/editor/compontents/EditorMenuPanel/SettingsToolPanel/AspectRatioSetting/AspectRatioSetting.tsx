import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {AspectRatio} from 'react-aspect-ratio';
import SideMenuSetting from '../../../ui/SideMenuSetting';
import useEditorDispatcher from '../../../../state/dispatchers/editor';
import {EditorAreaContainer} from '../../../../state/containers/EditorAreaContainer';
import {useRecoilValue} from 'recoil';
import {dimensionsState} from './../../../../state/atoms/template';
import {equals} from 'ramda';
// import {Dimensions} from '../../../../interfaces/StageConfig';
import * as React from 'react';

export const options = [
  {
    dimensions: {width: 1080, height: 1920},
    orientation: 'Portrait',
    description: 'Instagram & Facebook stories, Snapchat and TikTok',
    ratio: '9:16',
  },
  {
    dimensions: {width: 1536, height: 1920},
    orientation: 'Portrait',
    description: 'Twitter, Instagram and Facebook',
    ratio: '4:5',
  },
  {
    dimensions: {width: 1080, height: 1080},
    orientation: 'Square',
    description: 'Twitter, Instagram and Facebook',
    ratio: '1:1',
  },
  {
    dimensions: {width: 1920, height: 1536},
    orientation: 'Landscape',
    description: 'Twitter, Instagram and Facebook',
    ratio: '5:4',
  },
  {
    dimensions: {width: 1920, height: 1080},
    orientation: 'Landscape',
    description: 'Youtube and websites',
    ratio: '16:9',
  },
];

function AspectRatioSetting() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const {getScreenDimensions} = EditorAreaContainer.useContainer();
  const dimensions = useRecoilValue(dimensionsState);
  const {setCanvasDimensions} = useEditorDispatcher();
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    const index = options.findIndex((option) =>
      equals(dimensions, option.dimensions),
    );
    setSelectedIndex(index);
  }, [dimensions]);
  const handleChangeOption = (value: string) => {
    const {dimensions} = options.find(({ratio}) => ratio === value)!;
    setCanvasDimensions(dimensions, getScreenDimensions());
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const remSize = 9 / 4;
  const theme = createTheme({
    components: {
      MuiMenuItem: {
        styleOverrides: {
          root: {
            width: '100%',
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: {
            fontsize: '3rem',
          },
        },
      },
    },
  });

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    ratio: string,
    index: number,
  ) => {
    setSelectedIndex(index);
    handleChangeOption(ratio);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <SideMenuSetting label='Size'>
      <ThemeProvider theme={theme}>
        <List
          component='nav'
          aria-label='Device settings'
          sx={{
            bgcolor: 'rgb(237, 237, 237)',
            borderRadius: '4px',
            borderWidth: '1px',
            borderColor: 'black',
            padding: '0',
          }}>
          <ListItem
            button
            id='lock-button'
            aria-haspopup='listbox'
            aria-controls='lock-menu'
            aria-label='when device is locked'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}>
            <ListItemText
              primary='Size'
              secondary={`${options[selectedIndex].orientation} - ${options[selectedIndex].ratio}`}
            />
          </ListItem>
        </List>
        <Menu
          id='lock-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}>
          {options.map(({dimensions, orientation, ratio}, index) => (
            <MenuItem
              key={`${dimensions.width}x${dimensions.height}`}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, ratio, index)}>
              <div className='aspect-ratio-item-container'>
                <div className='aspect-ratio-showcase'>
                  <AspectRatio
                    className={`aspect-ratio-logo ${
                      index === selectedIndex ? 'aspect-ratio-selected' : ''
                    }`}
                    style={{
                      width: `${
                        (remSize * dimensions.width) / dimensions.height
                      }rem`,
                    }}
                    ratio={dimensions.width / dimensions.height}
                  />
                </div>
                <div className='aspect-ratio-name'>{orientation}</div>
                <div className='aspect-ratio-scale'>{ratio}</div>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </ThemeProvider>
    </SideMenuSetting>
  );
}
export default AspectRatioSetting;
