import Konva from 'konva';
import {useRecoilCallback} from 'recoil';
import {Dimensions, Template} from '../../interfaces/StageConfig';
import {
  activePanelState,
  isLoadingState,
  ratioState,
  savedTemplateState,
} from '../atoms/editor';
import {backgroundState} from '../atoms/template';
import {templateSelector} from '../selectors/template';

function useTemplateDispatcher() {
  const updateBackground = useRecoilCallback(
    ({set}) =>
      (background: Konva.ShapeConfig) => {
        set(backgroundState, (config) => ({...config, ...background}));
      },
    [],
  );
  const setLoadedTemplate = useRecoilCallback(
    ({set, reset}) =>
      (template: Template, screenDimensions: Dimensions) => {
        const canvasHeight = template.dimensions.height;
        const canvasWidth = template.dimensions.width;
        const ratio = Math.min(
          screenDimensions.height / canvasHeight,
          screenDimensions.width / canvasWidth,
        );
        set(isLoadingState, false);
        set(templateSelector, template);
        reset(activePanelState);
        set(ratioState, ratio);
        console.log('loaded');
      },
    [],
  );
  const setCurrentTemplateToSave = useRecoilCallback(
    ({set, snapshot}) =>
      async () => {
        const template = await snapshot.getPromise(templateSelector);
        set(savedTemplateState, template);
        return template;
      },
    [],
  );

  return {
    updateBackground,
    setLoadedTemplate,
    setCurrentTemplateToSave,
  };
}

export default useTemplateDispatcher;
