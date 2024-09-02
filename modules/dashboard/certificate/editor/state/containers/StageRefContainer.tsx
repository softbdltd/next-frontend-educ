import Konva from 'konva';
import {useCallback, useRef} from 'react';
import {createContainer} from 'unstated-next';

function useStageAreaState() {
  const stageAreaRef = useRef<Konva.Stage>(null);

  const getStageAreaRef = useCallback(() => {
    if (stageAreaRef.current) {
      return stageAreaRef.current;
    }
  }, [stageAreaRef]);

  return {
    stageAreaRef,
    getStageAreaRef,
  };
}

export const StageRefContainer = createContainer(useStageAreaState);
