import React from 'react';
import {Line, Rect} from 'react-konva';
import {useRecoilValue} from 'recoil';
import {ImageConfig, ShapeType, TextConfig} from '../../interfaces/Shape';
import {elementSelector} from '../../state/selectors/elements';
import GenericRenderer from './GenericRenderer';
import ImageRenderer from './ImageRenederer';
import TextRenderer from './TextRenderer';

interface Props {
  id: string;
}

function ElementRenderer({id}: Props) {
  const element = useRecoilValue(elementSelector(id));
  if (!element) {
    return null;
  }
  const {props, type} = element;

  switch (type) {
    case ShapeType.Text:
      return <TextRenderer id={id} key={id} props={props as TextConfig} />;
    case ShapeType.Input:
      return <TextRenderer id={id} key={id} props={props as TextConfig} />;
    case ShapeType.Image:
      return <ImageRenderer key={id} id={id} props={props as ImageConfig} />;
    case ShapeType.QrImage:
      return <ImageRenderer key={id} id={id} props={props as ImageConfig} />;
    case ShapeType.Rectangle:
      return (
        <GenericRenderer
          id={id}
          key={id}
          props={props}
          enabledAnchors={[
            'middle-left',
            'middle-right',
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-center',
            'bottom-right',
          ]}
          component={Rect}
        />
      );
    case ShapeType.Line:
      return (
        <GenericRenderer
          id={id}
          key={id}
          props={props}
          rotateEnabled={false}
          component={Line}
        />
      );

    default:
      throw new Error(`Unsupported element ${type}`);
  }
}

export default ElementRenderer;
