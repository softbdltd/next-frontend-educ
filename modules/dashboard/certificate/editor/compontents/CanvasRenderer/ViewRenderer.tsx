import _ from 'lodash';
import {useRouter} from 'next/router';
import qrcode from 'qrcode';
import React, {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {Layer, Rect, Stage} from 'react-konva';
import {useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilValue} from 'recoil';
import {useAuthUser} from '../../../../../../@core/utility/AppHooks';
import {educDomain} from '../../../../../../@core/common/constants';
import {YouthAuthUser} from '../../../../../../redux/types/models/CommonAuthUser';
import {
  useFetchCertificateTemplate,
  useFetchPrivateOrPublicCertificateIssue,
} from '../../../../../../services/instituteManagement/hooks';
import {CANVAS_STROKE, EDITOR_MARGIN} from '../../constants';
import useRatioControls from '../../hooks/useRatioControl';
import {ShapeType} from '../../interfaces/Shape';
import {CanvasElement, Dimensions} from '../../interfaces/StageConfig';
import {ratioState} from '../../state/atoms/editor';
import {backgroundState, dimensionsState} from '../../state/atoms/template';
import {EditorAreaContainer} from '../../state/containers/EditorAreaContainer';
import {ElementRefsContainer} from '../../state/containers/ElementRefsContainer';
import {StageRefContainer} from '../../state/containers/StageRefContainer';
import useTemplateDispatcher from '../../state/dispatchers/template';
import {
  generateOrganizationInfoData,
  generateYouthInfoData,
} from '../../utils/helpers';
import {loadTemplateImages} from '../../utils/template';
import Elements from './Elements';

type Props = {
  templateId?: string | number;
};

// const organization_data = {
//   membership_id_number: '123456',
//   title: 'Example Institute',
//   address: '123 Main Street, City',
//   contact_person_name: 'John Doe',
//   tin_no: '789012345',
//   previous_membership_no: '789',
//   first_issue_date: '2023-01-01',
//   expire_date: '2023-12-31',
//   last_update_date: '2023-06-15',
// };
const ViewRenderer = ({templateId}: Props) => {
  const {formatDate, formatNumber} = useIntl();
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
  const authUser = useAuthUser<YouthAuthUser>();

  const {data: issueData, isLoading: isLoadingIssueData} =
    useFetchPrivateOrPublicCertificateIssue(
      query?.certificateIssueId,
      authUser,
    );
  const {data: certificateTemplate, isLoading: isLoadingTemplate} =
    useFetchCertificateTemplate(Number(templateId));

  useEffect(() => {
    if (!isLoadingIssueData && issueData) {
      const learnerInfo = authUser?.isYouthUser
        ? authUser
        : issueData?.learner_profile;
      // const orgInfo = authUser?.isOrganizationUser
      //   ? authUser
      //   : issueData?.organization_profile;

      const orgInfo = issueData?.organization_profile;

      let certifcateData: any;
      if (authUser?.isIndustryAssociationUser || authUser?.isOrganizationUser) {
        certifcateData = generateOrganizationInfoData({
          issueData,
          profileInfo: orgInfo,
          formatDate,
          formatNumber,
        });
      } else {
        certifcateData = generateYouthInfoData({
          issueData,
          profileInfo: learnerInfo,
          formatDate,
        });
      }

      if (issueData?.certificate_template) {
        (async () => {
          try {
            let template = JSON.parse(
              issueData?.certificate_template as string,
            );

            await loadTemplate(template, certifcateData);
          } catch (error) {
            console.log('error parsing template', error);
          }
        })();
      }
    } else if (certificateTemplate?.template) {
      (async () => {
        try {
          let template = JSON.parse(certificateTemplate?.template as string);

          await loadTemplate(template);
        } catch (error) {
          console.log('error parsing template', error);
        }
      })();
    }
  }, [issueData, isLoadingIssueData, isLoadingTemplate]);

  const loadTemplate = async (template: any, learnerInfo?: any) => {
    if (learnerInfo) {
      template.elements.map((t: any) => {
        if (t.type === ShapeType.Input) {
          t.props.text = learnerInfo[t.props.class];
        }
      });
    }

    if (learnerInfo) {
      var qrElement = _.remove(
        template.elements,
        function (element: CanvasElement) {
          return element.type === 'qrImage';
        },
      )[0];
      if (qrElement && query?.certificateIssueId) {
        const qrImage = await qrcode.toDataURL(
          `${educDomain()}/certificate-view/${query.certificateIssueId}`,
        );
        qrElement.props.image = qrImage;
        template.elements.push(qrElement);
      }
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

export default ViewRenderer;
