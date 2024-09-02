import {RecoilState} from 'recoil';

export type HistoryItem = Array<{
  state: RecoilState<any>;
  current: any;
  previous: any;
}>;
