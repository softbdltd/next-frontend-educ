import Konva from 'konva';
import {atom, atomFamily} from 'recoil';
import {CanvasElement, Dimensions} from '../../interfaces/StageConfig';
import {editorElementsHistoryEffect} from './../effects/history';
export const dimensionsState = atom<Dimensions>({
  key: 'templateDimensionsState',
  default: {
    width: 1920,
    height: 1080,
  },
  effects_UNSTABLE: [editorElementsHistoryEffect],
});

export const backgroundState = atom<Konva.ShapeConfig>({
  key: 'backgroundState',
  default: {
    fill: 'rgba(255, 255, 255, 1)',
  },
  effects_UNSTABLE: [editorElementsHistoryEffect],
});

export const elementIdsState = atom<string[]>({
  key: 'elementIdsState',
  default: [],
  effects_UNSTABLE: [editorElementsHistoryEffect],
});

export const elementState = atomFamily<CanvasElement | undefined, string>({
  key: 'elementState',
  default: undefined,
  effects_UNSTABLE: () => [editorElementsHistoryEffect],
});
