import Konva from 'konva';
import {ShapeConfig} from 'konva/lib/Shape';
import {LineConfig} from 'konva/lib/shapes/Line';
import React from 'react';
import {KonvaNodeEvents} from 'react-konva';
import InteractiveKonvaElement from './InteractiveKonvaElement';

interface Props {
  id: string;
  component: React.ComponentType<(ShapeConfig | LineConfig) & KonvaNodeEvents>;
  props: Konva.ShapeConfig;
  rotateEnabled?: boolean;
  enabledAnchors?: string[];
}

function GenericRenderer({
  id,
  component: Component,
  props,
  rotateEnabled = true,
  enabledAnchors = [],
}: Props) {
  return (
    <InteractiveKonvaElement
      id={id}
      rotateEnabled={rotateEnabled}
      enabledAnchors={enabledAnchors}>
      {(additionalProps) => (
        <Component
          {...props}
          {...additionalProps}
          draggable={!props.isLocked}
        />
      )}
    </InteractiveKonvaElement>
  );
}
export default GenericRenderer;
