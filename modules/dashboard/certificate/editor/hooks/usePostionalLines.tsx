import Konva from 'konva';
import {useRecoilCallback} from 'recoil';
import {postionalLinesState} from '../state/atoms/editor';
import {elementSelector} from '../state/selectors/elements';
function usePositionalLines() {
  const updatePositionalLines = useRecoilCallback(
    ({snapshot, set}) =>
      (node: Konva.Shape | string) => {
        if (node instanceof Konva.Shape) {
          const stage = node.getStage();
          if (!stage) {
            return [];
          }

          const lines = [
            {stop: node.x(), orientation: 'vertical'},
            {stop: node.y(), orientation: 'horizontal'},
          ];
          const lineConfig = {
            stroke: 'rgb(0, 161, 255)',
            strokeWidth: 1,
            dash: [4, 6],
          };
          const newLine = lines.map((line) =>
            line.orientation === 'horizontal'
              ? {
                  ...lineConfig,
                  id: `guideline-${line.orientation}-${line.stop}`,
                  points: [-6000, 0, 6000, 0],
                  x: 0,
                  y: line.stop,
                }
              : {
                  ...lineConfig,
                  id: `guideline-${line.orientation}-${line.stop}`,
                  points: [0, -6000, 0, 6000],
                  x: line.stop,
                  y: 0,
                },
          );
          set(postionalLinesState, newLine);
          return lines;
        } else if (typeof node === 'string') {
          const element = snapshot
            .getLoadable(elementSelector(node))
            .getValue();
          const nodes = element?.props!;
          const lines = [
            {stop: nodes.x, orientation: 'vertical'},
            {stop: nodes.y, orientation: 'horizontal'},
          ];
          const lineConfig = {
            stroke: 'rgb(0, 161, 255)',
            strokeWidth: 1,
            dash: [4, 6],
          };
          const newLine = lines.map((line) =>
            line.orientation === 'horizontal'
              ? {
                  ...lineConfig,
                  id: `guideline-${line.orientation}-${line.stop}`,
                  points: [-6000, 0, 6000, 0],
                  x: 0,
                  y: line.stop,
                }
              : {
                  ...lineConfig,
                  id: `guideline-${line.orientation}-${line.stop}`,
                  points: [0, -6000, 0, 6000],
                  x: line.stop,
                  y: 0,
                },
          );
          set(postionalLinesState, newLine);
          return lines;
        }
      },
    [],
  );

  return {
    updatePositionalLines,
  };
}

export default usePositionalLines;
