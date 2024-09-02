import React, {useEffect, useMemo, useState} from 'react';
import {Layer, Rect, Stage} from 'react-konva';
import {useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilValue} from 'recoil';
import {CANVAS_STROKE, EDITOR_MARGIN} from '../../constants';
import {EditorAreaContainer} from '../../state/containers/EditorAreaContainer';
import {ElementRefsContainer} from '../../state/containers/ElementRefsContainer';
import useRatioControls from '../../hooks/useRatioControl';
import {Dimensions} from '../../interfaces/StageConfig';
import {isLoadingState, ratioState} from '../../state/atoms/editor';
import {backgroundState, dimensionsState} from '../../state/atoms/template';
import useElementsDispatcher from '../../state/dispatchers/elements';
import Elements from './Elements';
import Transformers from './Transformers';
import {StageRefContainer} from '../../state/containers/StageRefContainer';
import useTemplateDispatcher from '../../state/dispatchers/template';
import {useRouter} from 'next/router';
import {loadTemplateImages} from '../../utils/template';
import PositionLines from './PositionLines';
import {useFetchCertificateTemplate} from '../../../../../../services/instituteManagement/hooks';

function CanvasRenderer() {
  const ratio = useRecoilValue(ratioState);
  const dimensions = useRecoilValue(dimensionsState);
  const background = useRecoilValue(backgroundState);
  const isLoading = useRecoilValue(isLoadingState);
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();
  const {fitToScreen} = useRatioControls();
  const {clearSelection} = useElementsDispatcher();
  const {editorAreaRef, setScreenDimensions, getScreenDimensions} =
    EditorAreaContainer.useContainer();
  const {stageAreaRef} = StageRefContainer.useContainer();
  const [containerDimensions, setContainerDimensions] = useState<
    Dimensions | undefined
  >();
  const {query} = useRouter();

  const {setLoadedTemplate} = useTemplateDispatcher();
  useEffect(() => {
    if (editorAreaRef.current) {
      const containerDimensions = editorAreaRef.current.getBoundingClientRect();
      setScreenDimensions({
        width: containerDimensions.width - 2 * EDITOR_MARGIN,
        height: containerDimensions.height - 2 * EDITOR_MARGIN,
      });

      fitToScreen();

      const observer = new ResizeObserver((entries) => {
        const containerDimensions = entries[0].target.getBoundingClientRect();

        setContainerDimensions(containerDimensions);
        setScreenDimensions({
          width: containerDimensions.width - 2 * EDITOR_MARGIN,
          height: containerDimensions.height - 2 * EDITOR_MARGIN,
        });
      });

      observer.observe(editorAreaRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [editorAreaRef, fitToScreen, setScreenDimensions]);

  const {data: certificateTemplate, isLoading: isLoadingTemplate} =
    useFetchCertificateTemplate(Number(query?.certificateId));

  const loadTemplate = async (template: any) => {
    await loadTemplateImages(template);
    setLoadedTemplate(template, getScreenDimensions());
  };
  useEffect(() => {
    if (!isLoadingTemplate && certificateTemplate) {
      try {
        (async () => {
          const templateObj = JSON.parse(certificateTemplate?.template);
          await loadTemplate(templateObj);
        })();
      } catch (error) {
        console.log('error loading template-> ', error);
      }
    }
  }, [certificateTemplate, isLoadingTemplate]);

  const area = useMemo(() => {
    if (!containerDimensions) {
      return null;
    }

    const canvasArea = {
      width: dimensions.width * ratio + 2 * EDITOR_MARGIN,
      height: dimensions.height * ratio + 2 * EDITOR_MARGIN,
    };
    const stageDimensions = {
      width: Math.max(1, containerDimensions.width, canvasArea.width),
      height: Math.max(1, containerDimensions.height, canvasArea.height),
    };

    const offsetX =
      (Math.max(0, (stageDimensions.width - canvasArea.width) / 2) +
        EDITOR_MARGIN) /
      ratio;
    const offsetY =
      (Math.max(0, (stageDimensions.height - canvasArea.height) / 2) +
        EDITOR_MARGIN) /
      ratio;

    return {
      containerDimensions,
      stageDimensions,
      scale: {
        x: ratio,
        y: ratio,
      },
      offset: {
        x: -offsetX,
        y: -offsetY,
      },
    };
  }, [containerDimensions, dimensions.height, dimensions.width, ratio]);

  return (
    <div
      className={`canvas-area-container ${
        isLoading ? 'canvas-area-container-loading' : ''
      }`}
      ref={editorAreaRef}>
      {/* {isLoading && (
        <>
          <CircularProgress />
        </>
      )} */}

      {area && (
        <Stage
          scaleX={area.scale.x}
          scaleY={area.scale.y}
          offsetX={area.offset.x}
          offsetY={area.offset.y}
          width={area.stageDimensions.width}
          height={area.stageDimensions.height}
          onClick={clearSelection}
          ref={stageAreaRef}>
          <RecoilBridge>
            <ElementRefsContainer.Provider>
              <Layer>
                <Rect
                  x={-CANVAS_STROKE / ratio}
                  y={-CANVAS_STROKE / ratio}
                  width={dimensions.width + (2 * CANVAS_STROKE) / ratio}
                  height={dimensions.height + (2 * CANVAS_STROKE) / ratio}
                  shadowColor='black'
                  shadowOpacity={0.1}
                  shadowBlur={4}
                  shadowEnabled
                  fill='rgb(229, 231, 235)'
                />
                <Rect
                  width={dimensions.width}
                  height={dimensions.height}
                  shadowColor='black'
                  shadowOpacity={0.06}
                  shadowBlur={2}
                  shadowEnabled
                  {...background}
                />
              </Layer>
              <Layer
                clipX={0}
                clipY={0}
                clipWidth={dimensions.width}
                clipHeight={dimensions.height}>
                <Elements />
              </Layer>
              <Layer>
                <PositionLines />
                <Transformers />
              </Layer>
            </ElementRefsContainer.Provider>
          </RecoilBridge>
        </Stage>
      )}
    </div>
  );
}

export default CanvasRenderer;
