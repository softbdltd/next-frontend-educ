import {useRouter} from 'next/router';
import React, {useEffect, useMemo, useState} from 'react';
import {Layer, Rect, Stage} from 'react-konva';
import {useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilValue} from 'recoil';
import {CERTIFICATE_LANGUAGE} from '../../../Constants';
import {CANVAS_STROKE, EDITOR_MARGIN} from '../../constants';
import useRatioControls from '../../hooks/useRatioControl';
import {Dimensions} from '../../interfaces/StageConfig';
import {ratioState} from '../../state/atoms/editor';
import {backgroundState, dimensionsState} from '../../state/atoms/template';
import {ElementRefsContainer} from '../../state/containers/ElementRefsContainer';
import {EditorAreaContainer} from '../../state/containers/EditorAreaContainer';
import {StageRefContainer} from '../../state/containers/StageRefContainer';
import useTemplateDispatcher from '../../state/dispatchers/template';
import {loadTemplateImages} from '../../utils/template';
import Elements from './Elements';
import {useFetchCertificateTemplate} from '../../../../../../services/instituteManagement/hooks';
import {useFetch4IRIssuedCertificate} from '../../../../../../services/4IRManagement/hooks';

type Props = {
  templateId?: string | number;
};

const FourIRViewRenderer = ({templateId}: Props) => {
  const ratio = useRecoilValue(ratioState);
  const dimensions = useRecoilValue(dimensionsState);
  const background = useRecoilValue(backgroundState);
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();
  const {fitToScreen} = useRatioControls();
  const {getScreenDimensions} = EditorAreaContainer.useContainer();
  const {setLoadedTemplate} = useTemplateDispatcher();
  const {editorAreaRef, setScreenDimensions} =
    EditorAreaContainer.useContainer();
  const {stageAreaRef} = StageRefContainer.useContainer();

  const [containerDimensions, setContainerDimensions] = useState<
    Dimensions | undefined
  >();

  useEffect(() => {
    if (editorAreaRef.current) {
      const containerDimensions = editorAreaRef.current.getBoundingClientRect();
      setContainerDimensions(containerDimensions);

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
          height:
            containerDimensions.height < 500
              ? 500
              : containerDimensions.height - 2 * EDITOR_MARGIN,
        });
      });

      observer.observe(editorAreaRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [editorAreaRef, fitToScreen, setScreenDimensions]);

  const router = useRouter();
  const {query} = router;

  const {data: issueData, isLoading: isLoadingIssueData} =
    useFetch4IRIssuedCertificate(String(query?.certificateIssueId ?? ''));

  const {data: certificateTemplate, isLoading: isLoadingTemplate} =
    useFetchCertificateTemplate(Number(templateId));

  useEffect(() => {
    if (!isLoadingIssueData && issueData) {
      const isCertificateBangle =
        issueData?.certificate_template?.language ==
        CERTIFICATE_LANGUAGE.BANGLA;
      const certificateTemplate = issueData?.certificate_template?.template;

      let certificateData: any = {
        certificate_template: certificateTemplate,
      };

      certificateData['candidate-name'] = isCertificateBangle
        ? issueData?.participant_name
        : issueData?.participant_name_en;

      if (certificateTemplate) {
        (async () => {
          try {
            let template = JSON.parse(certificateTemplate as string);

            await loadTemplate(template, certificateData);
          } catch (error) {
            console.log('error parsing template', error);
          }
        })();
      }
    } else if (certificateTemplate?.template) {
      (async () => {
        try {
          let template = JSON.parse(certificateTemplate?.template);

          await loadTemplate(template);
        } catch (error) {
          console.log('error parsing template', error);
        }
      })();
    }
  }, [issueData, isLoadingIssueData, isLoadingTemplate]);

  const loadTemplate = async (template: any, certificateData?: any) => {
    if (certificateData) {
      template.elements.map((t: any) => {
        if (t.type === 'input') {
          t.props.text = certificateData[t.props.class];
        }
      });
    }
    await loadTemplateImages(template);
    setLoadedTemplate(template, getScreenDimensions());
  };

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
      className={`view-area-container ${
        isLoadingIssueData || isLoadingTemplate
          ? 'view-area-container-loading'
          : ''
      }`}
      ref={editorAreaRef}>
      {area && (
        <Stage
          scaleX={area.scale.x}
          scaleY={area.scale.y}
          // offsetX={area.offset.x}
          // offsetY={area.offset.y}
          width={dimensions.width * ratio}
          height={dimensions.height * ratio}
          ref={stageAreaRef}
          listening={false}>
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
            </ElementRefsContainer.Provider>
          </RecoilBridge>
        </Stage>
      )}
    </div>
  );
};

export default FourIRViewRenderer;
