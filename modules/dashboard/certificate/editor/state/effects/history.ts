import {RecoilState, AtomEffect} from 'recoil';

export const editorMenu: Array<RecoilState<any>> = [];
export const editorElements: Array<RecoilState<any>> = [];

export const editorMenuHistoryEffect: AtomEffect<any> = (props) => {
  editorMenu.push(props.node);
};

export const editorElementsHistoryEffect: AtomEffect<any> = (props) => {
  editorElements.push(props.node);
};
