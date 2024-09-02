import React from "react";
import { useRecoilValue } from "recoil";
import {
  highlightedElementIdState,
  selectedElementIdState,
} from "../../state/atoms/editor";
import { elementIdsState } from "../../state/atoms/template";
import TransformerRenderer from "./TransformerRenderer";

function Transformers() {
  const elementIds = useRecoilValue(elementIdsState);
  const selectedElementId = useRecoilValue(selectedElementIdState);
  const highlightedElementId = useRecoilValue(highlightedElementIdState);
  return (
    <>
      {[...elementIds].map((id) => (
        <TransformerRenderer
          key={id}
          elementId={id}
          isSelected={selectedElementId === id}
          isHighlighted={highlightedElementId === id}
        />
      ))}
    </>
  );
}

export default Transformers;
