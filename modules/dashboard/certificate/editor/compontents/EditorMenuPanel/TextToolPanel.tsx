import React from 'react';
import Button from '../ui/Button';
import {DefaultFonts} from '../../constants';
import {ShapeType, TextConfig} from '../../interfaces/Shape';
import useElementsDispatcher from '../../state/dispatchers/elements';
import SideMenuPanel from '../ui/SideMenuPanel';

const TEXT_PROPERTIES: {[key in DefaultFonts]: TextConfig} = {
  [DefaultFonts.Headline]: {
    text: 'Headline Text',
    fontSize: 48,
    fontStyle: 'bold',
    fontFamily: DefaultFonts.Headline,
    align: 'center',
    fillEnabled: true,
    fill: 'rgba(0, 0, 0, 1)',
    lineHeight: 1,
    shadowEnabled: false,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 5,
    strokeEnabled: false,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeWidth: 1,
  },
  [DefaultFonts.Regular]: {
    text: 'Normal Text',
    fontSize: 24,
    fontFamily: DefaultFonts.Regular,
    align: 'center',
    fillEnabled: true,
    fill: 'rgba(0, 0, 0, 1)',
    lineHeight: 1,
    shadowEnabled: false,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 5,
    strokeEnabled: false,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeWidth: 1,
  },
  [DefaultFonts.Cursive]: {
    text: 'Cursive text',
    fontSize: 36,
    fontFamily: DefaultFonts.Cursive,
    align: 'center',
    fillEnabled: true,
    fill: 'rgba(0, 0, 0, 1)',
    lineHeight: 1,
    shadowEnabled: false,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowBlur: 5,
    strokeEnabled: false,
    stroke: 'rgba(0, 0, 0, 1)',
    strokeWidth: 1,
  },
};

function TextToolPanel() {
  const {createElement} = useElementsDispatcher();

  const handleClickAddText = (font: DefaultFonts) => () => {
    createElement<TextConfig>(ShapeType.Text, TEXT_PROPERTIES[font]);
  };

  return (
    <SideMenuPanel title='Text'>
      <div className='text-picker-button-container'>
        <Button
          type='gray'
          className='text-picker-button'
          style={{
            fontFamily: DefaultFonts.Headline,
            fontWeight: 'bold',
          }}
          onClick={handleClickAddText(DefaultFonts.Headline)}>
          Headline Text
        </Button>

        <Button
          type='gray'
          className='text-picker-button'
          style={{fontFamily: DefaultFonts.Regular, fontWeight: 'normal'}}
          onClick={handleClickAddText(DefaultFonts.Regular)}>
          Normal Text
        </Button>
        <Button
          type='gray'
          className='text-picker-button'
          style={{fontFamily: DefaultFonts.Cursive, fontWeight: 'normal'}}
          onClick={handleClickAddText(DefaultFonts.Cursive)}>
          Cursive Text
        </Button>
      </div>
    </SideMenuPanel>
  );
}

export default TextToolPanel;
