import React from 'react';
import {ShapeType} from '../../interfaces/Shape';
import SideMenuPanel from '../ui/SideMenuPanel';
import useImageInput from '../../hooks/useImageInput';
import Button from './../ui/Button';
import {HiOutlineUpload} from 'react-icons/hi';
import useElementsDispatcher from '../../state/dispatchers/elements';
import useNotiStack from '../../../../../../@core/hooks/useNotifyStack';

function ImageToolPanel() {
  const {createElement} = useElementsDispatcher();
  const {changeImage, inputRef} = useImageInput();
  const {errorStack} = useNotiStack();

  const handleClickAddImage = () => {
    inputRef.current?.click();
  };

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file && file?.size > 1048576) {
      errorStack('File size is bigger than 1MB');
      return;
    }
    if (file) {
      const defaultProps = await changeImage(file);
      createElement(ShapeType.Image, {
        ...defaultProps,
        blurRadius: 0,
        imageFit: 'fill',
      });
    }
  };

  return (
    <SideMenuPanel title='Image'>
      <input
        className='input-hidden'
        ref={inputRef}
        type='file'
        onChange={handleChangeImage}
        accept='image/*'
      />
      <Button type='gray' icon={HiOutlineUpload} onClick={handleClickAddImage}>
        Upload image
      </Button>
      <div className='warning'> Accepted File size is 1MB</div>
    </SideMenuPanel>
  );
}

export default ImageToolPanel;
