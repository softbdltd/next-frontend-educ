import {useEffect, useState} from 'react';

interface IProps {
  id: string;
  dependency?: any;
}

const usePageLoadToTop = ({id, dependency}: IProps) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      let elem = window.document.querySelector('#' + id)?.parentElement
        ?.parentElement?.parentElement?.parentElement;
      if (!elem) return;
      // console.log('B: ', elem?.scrollTop);
      elem.scrollTop = 0;
      setData(elem);
      // console.log('A: ', elem?.scrollTop);
    }, 200);
  }, [dependency]);

  return data;
};

export default usePageLoadToTop;
