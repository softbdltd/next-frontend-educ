import React from 'react';
import {AspectRatio} from 'react-aspect-ratio';
import {useRecoilValue} from 'recoil';
import {Tooltip} from '@mui/material';
import useImageInput from '../../../hooks/useImageInput';
import {ImageConfig} from '../../../interfaces/Shape';
import useElementsDispatcher from '../../../state/dispatchers/elements';
import {elementPropsSelector} from '../../../state/selectors/elements';

interface Props {
  elementId: string;
}

function ImageFileSetting({elementId}: Props) {
  const {changeImage, inputRef} = useImageInput();
  const elementProps = useRecoilValue(
    elementPropsSelector<ImageConfig>(elementId),
  );
  const {updateElementProps} = useElementsDispatcher();

  const image = elementProps.image as HTMLImageElement;
  const handleClickChangeImage = () => {
    inputRef.current?.click();
  };

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (file) {
      const scaleX = elementProps.scaleX ?? 1;
      const scaleY = elementProps.scaleY ?? 1;

      updateElementProps<ImageConfig>(
        elementId,
        await changeImage(file, {
          width: image.width * scaleX,
          height: image.height * scaleY,
        }),
      );
    }
  };

  return (
    <Tooltip
      title='Change Image'
      placement='bottom'
      style={{display: 'flex', marginBottom: '1rem'}}
      arrow>
      <div>
        <input
          ref={inputRef}
          type='file'
          onChange={handleChangeImage}
          accept='image/*'
          className='input-hidden'
        />
        <button
          type='button'
          className='image-input-button'
          onClick={handleClickChangeImage}>
          {image && 'src' in image && (
            <AspectRatio
              className='image-input-showcase'
              ratio={image.width / image.height}>
              <div className=''>
                <img
                  className='image-input-view'
                  src={image.src}
                  alt='thumbnail preview'
                />
              </div>
            </AspectRatio>
          )}
        </button>
      </div>
    </Tooltip>
  );
}

export default ImageFileSetting;
