import {atom} from 'recoil';
import {HistoryItem} from '../../interfaces/History';

export const historyState = atom<HistoryItem[]>({
  key: 'historyState',
  default: [],
});

export const historyPresentState = atom({
  key: 'historyPresentState',
  default: -1,
});

export const historyControlsState = atom({
  key: 'historyControlsState',
  default: {
    undo: () => {},
    redo: () => {},
  },
});
