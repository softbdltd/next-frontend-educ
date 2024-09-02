import useRatioControl from '../../hooks/useRatioControl';
import {Tooltip} from '@mui/material';
import {BsZoomIn, BsZoomOut, BsArrowsFullscreen} from 'react-icons/bs';
import Button from '../ui/Button';
interface Props {
  increaseZoom: () => void;
  decreaseZoom: () => void;
}
function FitButtonComponent({increaseZoom, decreaseZoom}: Props) {
  const {fitToScreen} = useRatioControl();
  return (
    <>
      <Tooltip title='Fit To Screen(Shift+F)' className='flex'>
        <Button
          type={'secondary'}
          onClick={fitToScreen}
          className={'shape-action-button'}>
          <BsArrowsFullscreen className='zoom-action-button' />
        </Button>
      </Tooltip>
      <Tooltip title='Zoom In(Shift+I)' className='flex'>
        <Button
          type={'secondary'}
          onClick={increaseZoom}
          className={'shape-action-button'}>
          <BsZoomIn className='zoom-action-button' />
        </Button>
      </Tooltip>
      <Tooltip title='Zoom Out(Shift+D)' className='flex'>
        <Button
          type={'secondary'}
          onClick={decreaseZoom}
          className={'shape-action-button'}>
          <BsZoomOut className='zoom-action-button' />
        </Button>
      </Tooltip>
    </>
  );
}

export default FitButtonComponent;
