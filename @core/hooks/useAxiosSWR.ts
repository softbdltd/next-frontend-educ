import useSWR from 'swr';
import {apiGet} from '../common/api';
import {useIntl} from 'react-intl';
import {useEffect, useRef, useState} from 'react';
import {getBrowserCookie} from '../libs/cookieInstance';
import {COOKIE_KEY_APP_CURRENT_LANG} from '../../shared/constants/AppConst';

function common<T = any>({
  mutate,
  error,
  data: responseData,
  isValidating,
}: any) {
  const {data: {data = undefined, ...metaData} = {}} = responseData || {};

  return {
    data,
    metaData,
    isLoading: isValidating && !data && !error,
    mutate,
    error,
    isValidating,
  };
}

export function useAxiosSWR<T = any>(deps: any[] | string | null) {
  return common<T>(useSWR(deps, (url, params) => apiGet(url, {params})));
}

/**
 This use for all data localization excepts cms data
 */
export function useDataLocalizationAxiosSWR<T = any>(
  deps: any[] | string | null,
) {
  const data = common<T>(useSWR(deps, (url, params) => apiGet(url, {params})));

  const {locale} = useIntl();
  const [newDataObject, setNewDataObject] = useState<any>(data);
  const [loc, setLoc] = useState<any>(locale);
  const language = getBrowserCookie(COOKIE_KEY_APP_CURRENT_LANG) || 'bn';
  const locRef = useRef<string>('bn');

  useEffect(() => {
    if (
      newDataObject?.isLoading != data?.isLoading ||
      newDataObject?.data != data?.data ||
      loc != locale
    ) {
      const objIN = {...data};
      if (
        locale != loc ||
        locRef.current != 'bn' ||
        locRef.current != language
      ) {
        locRef.current = language;
        objIN.data = changeLocalData(objIN.data);
      }
      setLoc(locale);
      setNewDataObject(objIN);
    }
  }, [data, locale]);

  return newDataObject;
}

const changeLocalData = (dataObject: any) => {
  if (Array.isArray(dataObject)) {
    for (let i = 0; i < dataObject.length; i++) {
      dataObject[i] = swapLocalText(dataObject[i]);
    }
  } else {
    dataObject = swapLocalText(dataObject);
  }

  return dataObject;
};

const swapLocalText = (dataObject: any) => {
  for (let k in dataObject) {
    if (dataObject.hasOwnProperty(k) && typeof dataObject[k] == 'object') {
      dataObject[k] = changeLocalData(dataObject[k]);
    } else if (dataObject.hasOwnProperty(k) && k.endsWith('_en')) {
      const s = k.substr(0, k.length - 3);

      let temp = dataObject[s];
      dataObject[s] = dataObject[k] ? dataObject[k] : '';
      dataObject[k] = temp;
    }
  }

  return dataObject;
};

/**
 This use for data localization excepts
 */
export function useLocalizedAxiosSWR<T = any>(deps: any[] | string | null) {
  const language = getBrowserCookie(COOKIE_KEY_APP_CURRENT_LANG) || 'bn';
  const [loc, setLoc] = useState<any>(language);

  const data = common<T>(
    useSWR(
      typeof deps == 'string'
        ? [deps, loc]
        : Array.isArray(deps)
        ? [...deps, loc]
        : null,
      (url, params) =>
        apiGet(url, {
          params: {
            ...params,
            selected_language: loc,
          },
        }),
    ),
  );
  const {locale} = useIntl();

  useEffect(() => {
    if (locale) {
      let langCode = locale.split('-')[0];
      setLoc(langCode);
    }
  }, [loc, locale]);

  return data;
}
