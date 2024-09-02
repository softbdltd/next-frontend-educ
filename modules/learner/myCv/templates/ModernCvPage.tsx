import {Box, Slide} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {FC, useCallback, useEffect} from 'react';
import {AddressTypes} from '../../../../@core/utilities/AddressType';
import {useIntl} from 'react-intl';
import {
  getProps,
  getStructureData,
  setAreaText,
} from '../../../../@core/common/modern-svg-d3-util';
import LocaleLanguage from '../../../../@core/utilities/LocaleLanguage';
import pageSVG from '../../../../public/images/cv/CV_Temp_Modern';
import OtherPageSVG from '../../../../public/images/cv/CV_Temp_Modern_Other_Page';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../../@core/common/apiRoutes';
import {convertEnglishDigitsToBengali} from '../../../../@core/utilities/helpers';

const StyledBox = styled(Box)(({}) => ({
  border: '2px solid #d3d4d4',
  background: '#fff',
  padding: 20,
}));

interface ModernTemplateProps {
  userData: any;
  pageIndex: number;
  pageUserData: any;
  formatNumber: any;
}

const ModernCvPage: FC<ModernTemplateProps> = ({
                                                 userData,
                                                 pageIndex,
                                                 pageUserData,
                                                 formatNumber,
                                               }) => {
  const setPhoto = (data: any) => {
    let elem = document.getElementById('photo') as Element;
    let imgElem = elem.childNodes[1] as any;
    if (data.photo) {
      imgElem.setAttribute(
        'xlink:href',
        FILE_SERVER_FILE_VIEW_ENDPOINT + data.photo,
      );
    }
    if (!data.photo) {
      imgElem.setAttribute('src', './public/images/placeholder.jpg');
    }
  };

  const getValue = (obj: any, propsName: string, locale: string): string => {
    const propsKey = getProps(propsName, locale);
    let val = `${obj[propsKey]}`;
    return val !== 'null' ? val : '';
  };

  /** present address */
  const addressText = (userData: any, locale: string, type: number) => {
    let address = userData?.learner_addresses.filter(
      (item: any) => item.address_type == type,
    )[0];
    const propsArray = [
      'house_n_road',
      'village_ward_area',
      'zip_or_postal_code',
      'union_title',
      'upazila_municipality_title',
      'city_corporation_title',
      'district_title',
      'division_title',
    ];

    let addresstxt: string = ``;
    let addressArray = [];
    if (address) {
      for (let i = 0; i < propsArray.length; i++) {
        const element = propsArray[i];
        if (element == 'zip_or_postal_code') {
          if (address['zip_or_postal_code']) {
            addressArray.push(
              messages['common.zip_or_postal_code'] +
              ' - ' +
              formatNumber(address['zip_or_postal_code'], {
                useGrouping: false,
              }),
            );
          }
        } else {
          let propValue = getValue(address, element, locale);
          if (propValue && propValue != 'undefined') {
            if (
              [
                'union_title',
                'upazila_municipality_title',
                'city_corporation_title',
                'district_title',
                'division_title',
              ].includes(element)
            ) {
              propValue = propValue.toLowerCase();
              propValue =
                propValue.charAt(0).toUpperCase() + propValue.slice(1);
            }
            addressArray.push(propValue);
          }
        }
      }
    }

    if (addressArray.length == 0) {
      return ' ';
    }
    addresstxt +=
      addressArray.join(', ') + (locale === LocaleLanguage.BN ? '।' : '.');
    return addresstxt;
  };

  const renderFirstPageSVG = (language: string, node?: any) => {
    let exNode = document.getElementById('svg-div' + pageIndex);
    if (exNode) {
      node.removeChild(exNode);
    }

    const div = document.createElement('div');
    div.setAttribute('id', 'svg-div' + pageIndex);
    div.innerHTML = pageSVG;

    node.appendChild(div);
    const svgNode = div.children[0];

    const rects = svgNode.querySelectorAll('g[id]>text');
    for (let r = 0; r < rects.length; r++)
      // @ts-ignore
      if (rects[r].previousElementSibling) {
        // @ts-ignore
        rects[r].previousElementSibling.setAttribute('fill', 'transparent');
      }

    const capitalizeName =
      getValue(userData, 'first_name', language) +
      ' ' +
      getValue(userData, 'last_name', language);

    setPhoto(userData);
    setAreaText(svgNode, 'name', capitalizeName, 'cn');
    const address = addressText(userData, language, AddressTypes.PRESENT);

    setAreaText(
      svgNode,
      'contact-address',
      messages['common.contact_and_address'] as string,
      'lt',
    );
    setAreaText(svgNode, 'address', address, 'lt');

    let localizeMobile = language === LocaleLanguage.BN ? convertEnglishDigitsToBengali(userData?.mobile) : userData?.mobile;
    setAreaText(svgNode, 'phone', localizeMobile, 'lt');
    setAreaText(svgNode, 'email', userData?.email, 'lt');

    getStructureData(pageUserData, messages, language, pageIndex);
  };

  const renderOtherPageSVG = (language: string, node?: any) => {
    let exNode = document.getElementById('svg-div' + pageIndex);
    if (exNode) {
      node.removeChild(exNode);
    }

    let svgContent = OtherPageSVG;

    svgContent.replace('cv-sidebar1', `cv-sidebar${pageIndex}`);
    svgContent.replace('cv-body1', `cv-body${pageIndex}`);

    const div = document.createElement('div');
    div.setAttribute('id', 'svg-div' + pageIndex);
    div.innerHTML = svgContent;

    node.appendChild(div);
    const svgNode = div.children[0];

    const rects = svgNode.querySelectorAll('g[id]>text');
    for (let r = 0; r < rects.length; r++)
      // @ts-ignore
      if (rects[r].previousElementSibling) {
        // @ts-ignore
        rects[r].previousElementSibling.setAttribute('fill', 'transparent');
      }

    getStructureData(pageUserData, messages, language, pageIndex);
  };

  const {messages, locale} = useIntl();
  const theCB = useCallback(
    (node: any) => {
      if (!node || node.children.length > 0) return;

      if (pageIndex === 0) {
        renderFirstPageSVG(locale, node);
      } else {
        renderOtherPageSVG(locale, node);
      }
    },
    [locale],
  );

  useEffect(() => {
    let exNode = document.getElementById('svgBox' + pageIndex);
    if (pageIndex === 0) {
      renderFirstPageSVG(locale, exNode);
    } else {
      renderOtherPageSVG(locale, exNode);
    }
  }, [locale]);

  return (
    <Slide direction={'right'} in={true}>
      <StyledBox
        id={'svgBox' + pageIndex}
        sx={{padding: '0 !important'}}
        ref={theCB}
      />
    </Slide>
  );
};

export default ModernCvPage;
