import Konva from 'konva';
import {KonvaEventObject} from 'konva/lib/Node';
import {omit} from 'ramda';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {KonvaNodeEvents} from 'react-konva';
import {useRecoilCallback} from 'recoil';
import {ElementRefsContainer} from '../../state/containers/ElementRefsContainer';
import {dimensionsState} from '../../state/atoms/template';
import useElementsDispatcher from '../../state/dispatchers/elements';
import {highlightedElementIdState} from '../../state/atoms/editor';
import usePositionalLines from './../../hooks/usePostionalLines';
import {postionalLinesState} from '../../state/atoms/editor';

export const MIN_WIDTH = 5;
export const MIN_HEIGHT = 5;

interface Props {
  id: string;
  children: (props: Konva.ShapeConfig & KonvaNodeEvents) => React.ReactElement;
  transform?: (
    evt: KonvaEventObject<Event>,
    transformer: Konva.Transformer,
  ) => Konva.ShapeConfig;
  transformEnd?: (
    evt: KonvaEventObject<Event>,
    transformer: Konva.Transformer,
  ) => Konva.ShapeConfig;
  enabledAnchors?: string[];
  rotateEnabled?: boolean;
  keepRatio?: boolean;
  centeredScaling?: boolean;
}

const InteractiveKonvaElement = ({
  id,
  children,
  transform,
  transformEnd,
  enabledAnchors = [],
  rotateEnabled = true,
  keepRatio = true,
  centeredScaling = false,
}: Props) => {
  const {updateElementProps, selectElement, deleteElement} =
    useElementsDispatcher();
  const {transformerRef, setElementRef} = ElementRefsContainer.useContainer();
  const {updatePositionalLines} = usePositionalLines();
  const shapeRef = useRef<Konva.Shape & {isLocked: boolean}>(null);
  useEffect(() => {
    if (shapeRef.current) {
      setElementRef(id, shapeRef.current, {
        keepRatio,
        enabledAnchors,
        rotateEnabled,
        centeredScaling,
      });

      if (centeredScaling) {
        shapeRef.current.offsetX(shapeRef.current.width() / 2);
        shapeRef.current.offsetY(shapeRef.current.height() / 2);
      }

      return () => {
        setElementRef(id, undefined);
      };
    }
  }, [centeredScaling, id, keepRatio, setElementRef]);

  const handleSelect = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      evt.cancelBubble = true;
      selectElement(id);
    },
    [id, selectElement],
  );

  const handleChange = useCallback(
    (props: Konva.ShapeConfig) => {
      updateElementProps(id, props);
    },
    [id, updateElementProps],
  );

  const isOutOfBounds = useRecoilCallback(
    ({snapshot}) =>
      (node: Konva.Shape) => {
        const dimensions = snapshot.getLoadable(dimensionsState).getValue();
        return (
          node.x() + node.width() * node.scaleX() <= 0 ||
          node.x() >= dimensions.width ||
          node.y() + node.height() * node.scaleY() <= 0 ||
          node.y() >= dimensions.height
        );
      },
    [],
  );

  const handleTransform = useCallback(
    (evt: KonvaEventObject<Event>) => {
      const shape = shapeRef.current;
      if (!shape) {
        return;
      }
      if (transformerRef.current && transform) {
        shape.setAttrs(transform(evt, transformerRef.current));
      }

      if (centeredScaling) {
        shape.offsetX(shape.width() / 2);
        shape.offsetY(shape.height() / 2);
      }
    },
    [centeredScaling, transform, transformerRef],
  );
  const handleDragEnd = useRecoilCallback(
    ({reset}) =>
      () => {
        reset(postionalLinesState);
        if (!shapeRef.current) {
          return;
        }

        handleChange({
          x: shapeRef.current.x(),
          y: shapeRef.current.y(),
        });
      },
    [deleteElement, handleChange, id, isOutOfBounds],
  );

  const handleTransformEnd = useRecoilCallback(
    ({reset}) =>
      (evt: KonvaEventObject<Event>) => {
        const shape = shapeRef.current;
        if (!shape) {
          return;
        }

        if (transformerRef.current && transformEnd) {
          shape.setAttrs(transformEnd(evt, transformerRef.current));
        }

        if (centeredScaling) {
          shape.offsetX(shape.width() / 2);
          shape.offsetY(shape.height() / 2);
        }
        if (isOutOfBounds(shape)) {
          deleteElement(id);
        } else {
          handleChange({
            ...omit(
              centeredScaling ? ['offsetX', 'offsetY'] : [],
              shape.getAttrs(),
            ),
          });
        }
      },
    [
      centeredScaling,
      deleteElement,
      handleChange,
      id,
      isOutOfBounds,
      transformEnd,
      transformerRef,
    ],
  );

  const handleMouseEnter = useRecoilCallback(
    ({set, snapshot}) =>
      () => {
        const highlightedElementId = snapshot
          .getLoadable(highlightedElementIdState)
          .getValue();
        if (highlightedElementId !== id) {
          set(highlightedElementIdState, id);
        }
      },
    [id],
  );

  const handleMouseLeave = useRecoilCallback(
    ({reset}) =>
      () => {
        reset(highlightedElementIdState);
      },
    [],
  );

  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!(e.target instanceof Konva.Stage)) {
        updatePositionalLines(e.target);
      }
    },
    [updatePositionalLines],
  );
  return useMemo(() => {
    return children({
      id,
      onClick: handleSelect,
      onTap: handleSelect,
      ref: shapeRef,
      draggable: true,
      onDragEnd: handleDragEnd,
      onDragMove: handleDragMove,
      onDragStart: handleSelect,
      onTransform: handleTransform,
      onTransformEnd: handleTransformEnd,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    });
  }, [
    children,
    handleDragEnd,
    handleMouseEnter,
    handleMouseLeave,
    handleSelect,
    handleTransformEnd,
    handleDragMove,
    handleDragEnd,
    id,
  ]);
};

export default InteractiveKonvaElement;
