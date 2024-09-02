import Konva from 'konva';
import {ShapeConfig} from 'konva/lib/Shape';
import {move} from './../../utils/move';
import {useRecoilCallback} from 'recoil';
import {uuid} from '../../utils/uuid';
import {SHAPE_PROPERTIES_PANEL, SHAPE_TOOL_PANEL} from '../../constants';
import {ShapeType} from '../../interfaces/Shape';
import {CanvasElement} from '../../interfaces/StageConfig';
import {activePanelState, selectedElementIdState} from '../atoms/editor';
import {dimensionsState, elementIdsState} from '../atoms/template';
import {selectedElementSelector} from '../selectors/editor';
import {
  elementSelector,
  isSelectedElementSelector,
} from '../selectors/elements';
import usePositionalLines from '../../hooks/usePostionalLines';
import {postionalLinesState} from '../../state/atoms/editor';
import {Directions} from './../../constants';

function useElementsDispatcher() {
  const {updatePositionalLines} = usePositionalLines();
  const updateElementProps = useRecoilCallback(
    ({snapshot, set}) =>
      <T extends ShapeConfig>(id: string, properties: Partial<T>) => {
        const element = snapshot.getLoadable(elementSelector(id)).getValue();

        if (element) {
          set(
            elementSelector(id),
            (element) =>
              element && {
                ...element,
                props: {
                  ...element.props,
                  ...properties,
                },
              },
          );
        }
      },
  );

  const reorderElement = useRecoilCallback(
    ({snapshot, set}) =>
      (id: string, inc: number) => {
        const elementIds = snapshot.getLoadable(elementIdsState).getValue();
        const index = elementIds.findIndex((elementId) => id === elementId);
        set(elementIdsState, move(elementIds, index, index + inc));
      },
    [],
  );

  const selectElement = useRecoilCallback(
    ({snapshot, set, reset}) =>
      (element: string | CanvasElement) => {
        const selectedElementId = snapshot
          .getLoadable(selectedElementIdState)
          .getValue();
        const canvasElement =
          typeof element === 'string'
            ? snapshot.getLoadable(elementSelector(element)).getValue()
            : element;

        if (!canvasElement || selectedElementId === canvasElement.id) {
          return;
        }

        set(selectedElementIdState, canvasElement.id);
        const elementPanel = SHAPE_PROPERTIES_PANEL[canvasElement.type];
        if (elementPanel) {
          set(activePanelState, elementPanel);
        }
        reset(postionalLinesState);
      },
    [],
  );

  const clearSelection = useRecoilCallback(
    ({snapshot, reset, set}) =>
      () => {
        const element = snapshot
          .getLoadable(selectedElementSelector)
          .getValue();

        if (!element) {
          return;
        }

        const elementPanel = SHAPE_TOOL_PANEL[element.type];
        if (elementPanel) {
          set(activePanelState, elementPanel);
        } else {
          reset(activePanelState);
        }

        reset(selectedElementIdState);
        reset(postionalLinesState);
      },
    [],
  );

  const deleteElement = useRecoilCallback(
    ({reset, snapshot}) =>
      (id: string) => {
        if (snapshot.getLoadable(isSelectedElementSelector(id)).getValue()) {
          clearSelection();
        }
        reset(elementSelector(id));
      },
    [clearSelection],
  );

  const deleteSelectedElement = useRecoilCallback(
    ({snapshot}) =>
      () => {
        const selectedElementId = snapshot
          .getLoadable(selectedElementIdState)
          .getValue();
        if (selectedElementId) {
          deleteElement(selectedElementId);
        }
      },
    [deleteElement],
  );
  const updateSelectedElement = useRecoilCallback(
    ({snapshot}) =>
      (key?: string) => {
        const selectedElementId = snapshot
          .getLoadable(selectedElementIdState)
          .getValue();

        if (selectedElementId) {
          const element = snapshot
            .getLoadable(elementSelector(selectedElementId))
            .getValue();
          if (element && !element?.props.isLocked) {
            updatePositionalLines(selectedElementId);
            if (!element?.props.isLocked) {
              if (key === 'arrowright') {
                updateElementProps(selectedElementId, {
                  x: element?.props?.x! + 4,
                });
                updatePositionalLines(selectedElementId);
              } else if (key === 'arrowleft') {
                updateElementProps(selectedElementId, {
                  x: element?.props?.x! - 4,
                });
                updatePositionalLines(selectedElementId);
              } else if (key === 'arrowup') {
                updateElementProps(selectedElementId, {
                  y: element?.props?.y! - 4,
                });
                updatePositionalLines(selectedElementId);
              } else if (key === 'arrowdown') {
                updateElementProps(selectedElementId, {
                  y: element?.props?.y! + 4,
                });
                updatePositionalLines(selectedElementId);
              }
            }
          }
        }
      },
    [updateElementProps],
  );

  const createElement = useRecoilCallback(
    ({snapshot, set}) =>
      <Config extends Konva.NodeConfig>(type: ShapeType, props: Config) => {
        const {x, y, scaleX = 1, scaleY = 1} = props;

        const BoundsShape: typeof Konva.Shape =
          (
            {
              [ShapeType.Text]: Konva.Text,
              [ShapeType.Rectangle]: Konva.Rect,
              [ShapeType.Image]: Konva.Image,
              [ShapeType.QrImage]: Konva.Image,
              [ShapeType.RegulaPolygon]: Konva.RegularPolygon,
              [ShapeType.Line]: Konva.Line,
              [ShapeType.Input]: Konva.Text,
            } as any
          )[type] ?? Konva.Shape;

        const dimensions = snapshot.getLoadable(dimensionsState).getValue();
        const bounds = new BoundsShape(props).getClientRect();
        const centeredX = dimensions.width / 2 - bounds.width / 2 - bounds.x;
        const centeredY = dimensions.height / 2 - bounds.height / 2 - bounds.y;
        const element = {
          id: uuid(type),
          props: {
            ...props,
            scaleX,
            scaleY,
            isLocked: false,
            x: x ?? centeredX,
            y: y ?? centeredY,
          },
          type,
        };
        set(elementSelector(element.id), element);
        selectElement(element);
      },
    [selectElement],
  );

  const duplicateElement = useRecoilCallback(
    ({snapshot}) =>
      (id: string) => {
        const element = snapshot.getLoadable(elementSelector(id)).getValue();
        if (element) {
          createElement(element.type, {
            ...element.props,
            x: undefined,
            y: undefined,
          });
        }
      },
    [createElement],
  );
  const centeredElement = useRecoilCallback(
    ({snapshot}) =>
      (id: string, direction: Directions) => {
        const element = snapshot.getLoadable(elementSelector(id)).getValue();
        if (element) {
          const BoundsShape: typeof Konva.Shape =
            (
              {
                [ShapeType.Text]: Konva.Text,
                [ShapeType.Rectangle]: Konva.Rect,
                [ShapeType.Image]: Konva.Image,
                [ShapeType.RegulaPolygon]: Konva.RegularPolygon,
                [ShapeType.Line]: Konva.Line,
                [ShapeType.Input]: Konva.Text,
              } as any
            )[element.type] ?? Konva.Shape;

          const dimensions = snapshot.getLoadable(dimensionsState).getValue();
          const bounds = new BoundsShape({...element.props}).getClientRect();
          if (direction === Directions.Horizontal) {
            const centeredX = dimensions.width / 2 - bounds.width / 2;
            updateElementProps(id, {
              x: centeredX,
            });
          } else if (direction === Directions.Vertical) {
            const centeredY = dimensions.height / 2 - bounds.height / 2;
            updateElementProps(id, {
              y: centeredY,
            });
          }
          // const centeredY =
          //   dimensions.height / 2 - bounds.height / 2 - bounds.y;
        }
      },
    [],
  );
  return {
    deleteElement,
    createElement,
    duplicateElement,
    updateElementProps,
    deleteSelectedElement,
    updateSelectedElement,
    reorderElement,
    selectElement,
    clearSelection,
    centeredElement,
  };
}

export default useElementsDispatcher;
