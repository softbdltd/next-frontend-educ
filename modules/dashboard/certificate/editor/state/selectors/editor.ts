// import { equals } from "ramda";
import { selector, selectorFamily } from "recoil";
import { EditorPanel } from "../../interfaces/Editor";
import { activePanelState } from "../atoms/editor";
import { elementState } from "../atoms/template";
// import { templateSelector } from "./template";
import { selectedElementIdState } from "./../atoms/editor";
export const isEitherPanelActiveSelector = selectorFamily({
  key: "isEitherPanelActiveSelector",
  get:
    (panels: EditorPanel[]) =>
    ({ get }) =>
      panels.includes(get(activePanelState)),
});

export const selectedElementSelector = selector({
  key: "selectedElementSelector",
  get: ({ get }) => {
    const selectedElementId = get(selectedElementIdState);
    return selectedElementId ? get(elementState(selectedElementId)) : undefined;
  },
});
