import { useRecoilCallback } from "recoil";
import { Dimensions } from "../../interfaces/StageConfig";
import { ratioState } from "../atoms/editor";
import { dimensionsState } from "../atoms/template";

function useEditorDispatcher() {
  const setFitCanvasToScreen = useRecoilCallback(
    ({ set, snapshot }) =>
      async (screenDimensions: Dimensions, canvasDimensions?: Dimensions) => {
        const { height, width } =
          canvasDimensions ?? (await snapshot.getPromise(dimensionsState));
        const ratio = Math.max(
          0.01,
          Math.min(
            screenDimensions.height / height,
            screenDimensions.width / width
          )
        );
        set(ratioState, ratio);
      },
    []
  );

  const setCanvasDimensions = useRecoilCallback(
    ({ set }) =>
      async (canvasDimensions: Dimensions, screenDimensions: Dimensions) => {
        set(dimensionsState, canvasDimensions);
        await setFitCanvasToScreen(screenDimensions, canvasDimensions);
      },
    [setFitCanvasToScreen]
  );

  return {
    setFitCanvasToScreen,
    setCanvasDimensions,
  };
}

export default useEditorDispatcher;
