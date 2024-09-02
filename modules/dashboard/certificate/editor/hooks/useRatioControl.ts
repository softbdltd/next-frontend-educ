import { useCallback } from "react";
import { EditorAreaContainer } from "../state/containers/EditorAreaContainer";
import useEditorDispatcher from "../state/dispatchers/editor";

function useRatioControls() {
  const { getScreenDimensions } = EditorAreaContainer.useContainer();
  const { setFitCanvasToScreen } = useEditorDispatcher();

  const fitToScreen = useCallback(() => {
    setFitCanvasToScreen(getScreenDimensions());
  }, [getScreenDimensions, setFitCanvasToScreen]);

  return {
    fitToScreen,
  };
}

export default useRatioControls;
