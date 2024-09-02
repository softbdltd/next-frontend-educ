import {useRouter} from 'next/router';
import React, {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {Layer, Rect, Stage} from 'react-konva';
import {useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilValue} from 'recoil';
import {
  convertEnglishDigitsToBengali,
  getIntlDateFromString,
  getMomentDateFormat,
} from '../../../../../../@core/utilities/helpers';
import {CERTIFICATE_LANGUAGE, CERTIFICATE_TYPE} from '../../../Constants';
import {CANVAS_STROKE, EDITOR_MARGIN} from '../../constants';
import useRatioControls from '../../hooks/useRatioControl';
import {CanvasElement, Dimensions} from '../../interfaces/StageConfig';
import {ratioState} from '../../state/atoms/editor';
import {backgroundState, dimensionsState} from '../../state/atoms/template';
import {ElementRefsContainer} from '../../state/containers/ElementRefsContainer';
import {EditorAreaContainer} from '../../state/containers/EditorAreaContainer';
import {StageRefContainer} from '../../state/containers/StageRefContainer';
import useTemplateDispatcher from '../../state/dispatchers/template';
import {loadTemplateImages} from '../../utils/template';
import Elements from './Elements';
import {useFetchPublicCertificateIssue} from '../../../../../../services/instituteManagement/hooks';
import {ShapeType} from '../../interfaces/Shape';
import _ from 'lodash';

const ViewRendererPublic = () => {
  const {formatDate} = useIntl();
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
    useFetchPublicCertificateIssue(query?.certificateIssueId);

  useEffect(() => {
    if (!isLoadingIssueData && issueData) {
      const isCertificateBangle =
        issueData.certificate_language == CERTIFICATE_LANGUAGE.BANGLA;

      let learnerData: any = {
        certificate_template: issueData.certificate_template,
        'batch-name':
          issueData[isCertificateBangle ? 'batch_name' : 'batch_name_en'],
        'batch-start-date': isCertificateBangle
          ? getIntlDateFromString(
              formatDate,
              issueData.batch_start_date,
              'short',
            )
          : getMomentDateFormat(issueData.batch_start_date, 'DD MMMM, YYYY'),
        'batch-end-date': isCertificateBangle
          ? getIntlDateFromString(formatDate, issueData.batch_end_date, 'short')
          : getMomentDateFormat(issueData.batch_end_date, 'DD MMMM, YYYY'),
        'course-name':
          issueData[isCertificateBangle ? 'course_name' : 'course_name_en'],
        'training-center':
          issueData[
            isCertificateBangle
              ? 'training_center_name'
              : 'training_center_name_en'
          ],
        'father-name':
          issueData[isCertificateBangle ? 'father_name' : 'father_name_en'],
        'mother-name':
          issueData[isCertificateBangle ? 'mother_name' : 'mother_name_en'],
        'candidate-nid': isCertificateBangle
          ? convertEnglishDigitsToBengali(issueData?.nid_number)
          : issueData?.nid_number,
        marks:
          issueData?.certificate_type ==
          CERTIFICATE_TYPE.COMPETENT_NOT_COMPETENT
            ? issueData.result?.result == 'Pass'
              ? 'Competent'
              : 'Not Competent'
            : issueData.result?.result,
        grade: issueData.grade,
        'candidate-name': isCertificateBangle
          ? `${issueData.first_name} ${issueData.last_name}`
          : `${issueData.first_name_en} ${issueData.last_name_en}`,
      };

      if (issueData?.certificate_template) {
        (async () => {
          try {
            let template = JSON.parse(
              issueData?.certificate_template as string,
            );

            await loadTemplate(template, learnerData);
          } catch (error) {
            console.log('error parsing template', error);
          }
        })();
      }
    }
  }, [issueData, isLoadingIssueData]);

  const loadTemplate = async (template: any, learnerInfo?: any) => {
    if (learnerInfo) {
      template.elements.map((t: any) => {
        if (t.type === ShapeType.Input) {
          t.props.text = learnerInfo[t.props.class];
        }
      });
    }

    _.remove(template.elements, function (element: CanvasElement) {
      return element.type === 'qrImage';
    });

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
        isLoadingIssueData ? 'view-area-container-loading' : ''
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

export default ViewRendererPublic;
