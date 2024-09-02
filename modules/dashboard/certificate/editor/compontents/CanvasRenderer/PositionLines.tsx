import React from 'react';
import {Line} from 'react-konva';
import {useRecoilValue} from 'recoil';
import {postionalLinesState} from '../../state/atoms/editor';

function PositionLines() {
  const positionalLines = useRecoilValue(postionalLinesState);
  return positionalLines.length ? (
    <>
      {positionalLines.map((props) => (
        <Line key={props.id} {...props} />
      ))}
    </>
  ) : null;
}

export default PositionLines;
