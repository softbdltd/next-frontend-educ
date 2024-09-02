import {useCallback, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Container, Grid} from '@mui/material';
import SectionTitle from './SectionTitle';
import Districts from '../../shared/json/Districts.json';
import Map from '../../shared/json/Map.json';
import Demand from '../../shared/json/Demand.json';
import Supply from '../../shared/json/Supply.json';
import Chartist from 'chartist';
import {useIntl} from 'react-intl';
import {
  getDistrictWiseTotalYouth,
  getMapDataStatistics,
} from '../../services/global/globalService';
import DistrictsIds from '../../shared/json/DistrictsIds.json';
import {educDomain} from '../../@core/common/constants';
import DistrictsIdsWithDivision from '../../shared/json/DistrictsIdsWithDivision.json';

const DemandColor = 'rgb(36,141,36)';
const SupplyColor = 'rgb(104, 41, 136)';

const PREFIX = 'BdMap';

export const classes = {
  mapButtonGroup: `${PREFIX}-mapButtonGroup`,
  skillButton: `${PREFIX}-skillButton`,
  map: `${PREFIX}-map`,
  mapSidePoints: `${PREFIX}-mapSidePoints`,
  mapIndicator: `${PREFIX}-mapIndicator`,
  tabListBox: `${PREFIX}-tabListBox`,
  TabPanelBox: `${PREFIX}-TabPanelBox`,
};

export const StyledGrid = styled(Grid)(({theme}) => ({
  paddingTop: '10px',
  [`& .${classes.mapButtonGroup}`]: {
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
    // marginBottom: '29px',
    width: '100%',
    // maxWidth: '610px',
    marginTop: '0px',
  },

  [`& .${classes.skillButton}`]: {
    /*background: '#682988',
    color: '#fff',
    justifyContent: 'center',
    marginRight: '2px',
    minWidth: '98px',*/
  },

  [`& .${classes.map}`]: {
    position: 'relative',
    border: '1px solid #eee',
    borderRadius: '2px',
    backgroundColor: theme.palette.grey[50],
  },

  [`& .${classes.mapSidePoints}`]: {
    borderRadius: '50%',
    height: '5px',
    width: '5px',
    marginTop: '5px',
    marginLeft: '5px',
  },
  [`& .${classes.mapIndicator}`]: {
    position: 'absolute',
    backgroundColor: theme.palette.common.white,
    right: '3px',
    bottom: '3px',
    width: '130px',
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
    padding: '5px',
  },

  [`& .${classes.tabListBox}`]: {
    // maxWidth: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  [`& .${classes.TabPanelBox}`]: {
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    // border: '1px solid #eee',
    // borderRadius: '2px',
    // backgroundColor: theme.palette.grey[50]
    // minHeight: '450px',
    width: '100%',
  },

  [`& .${classes.TabPanelBox}>div:not([hidden])`]: {
    width: '100%',
    height: '100%',
    // minHeight: '480px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  [`& .${classes.TabPanelBox}>div>div`]: {
    width: '100%',
    // maxWidth: '640px',
  },
}));

export const StyledBox = styled(Box)(() => ({
  // border: '2px solid #d3d4d4',
  borderRadius: '20px',
  background: '#fff',
  paddingLeft: 3,
  paddingRight: 3,
  perspective: '1000px',
  overflow: 'hidden',
  // maxWidth: '640px',
  width: '100%',

  [`& .map-svgs`]: {
    borderRadius: '5px',
    // boxShadow: theme.shadows[3],
    // marginBottom: '29px',
    width: '100%',
    height: '640px',
    marginTop: '0px',
    position: 'relative',
    transition: 'transform 1s ease-out',
  },

  [`& .map-svgs svg`]: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'transform 1s ease-out',
  },

  [`& .hidden`]: {
    pointerEvents: 'none !important',
    opacity: 0,
  },

  [`& .map-svgs svg.map-names`]: {
    pointerEvents: 'none',
  },

  [`& .map-svgs svg.demand-map polygon`]: {
    fill: DemandColor,
  },

  [`& .map-svgs svg.supply-map polygon`]: {
    fill: SupplyColor,
  },

  [`& .map-svgs svg>g>g`]: {
    cursor: 'pointer',
  },

  [`& .map-svgs svg>g>g:hover`]: {
    filter: 'drop-shadow(0px 0px 5px blue)',
    stroke: 'blue',
  },

  [`& .map-svgs svg text`]: {
    fontSize: '0.5rem',
    pointerEvents: 'none',
  },

  [`& .map-ui`]: {
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    pointerEvents: 'none',
  },

  [`& .map-ui > div`]: {
    display: 'block',
    position: 'relative',
    pointerEvents: 'all',
  },

  [`& .map-ui .data-source`]: {
    display: 'none',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 0,
    width: '100%',
    height: 'auto',
    overflow: 'auto',
    padding: '6px 12px 3px',
    fontSize: '12px',
    background: '#ddd8',
    transform: 'translateZ(0px)',
  },

  [`& .map-ui .toggle-ds, & .toggle-4ir`]: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 4,
    height: 'auto',
    overflow: 'auto',
    padding: '8px 16px',
    background: '#eee',
    filter: 'drop-shadow(0px 0px 4px #0008)',
    transform: 'translateZ(0px)',
    [`&.toggle-ds`]: {
      display: 'none',
    },
    [`& input`]: {
      display: 'none',
    },
    [`& label`]: {
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      lineHeight: '1',
      fontSize: '14px',
      transform: 'translateY(2px)',
    },
    [`& label::after`]: {
      content: '""',
      display: 'inline-block',
      width: '14px',
      height: '14px',
      borderRadius: '14px',
      marginLeft: '10px',
      transform: 'translateY(-2px)',
      boxShadow: `0 0 0 2px ${DemandColor} inset`,
      backgroundColor: DemandColor,
    },
    [`& label~label`]: {
      marginLeft: '16px',
    },
    [`& label~label::after`]: {
      boxShadow: `0 0 0 2px ${SupplyColor} inset`,
      backgroundColor: SupplyColor,
    },
    [`& input:not(:checked)+label::after`]: {
      backgroundColor: 'transparent',
    },
    [`&.supply-type label::after`]: {
      backgroundColor: SupplyColor,
    },
    [`&.toggle-4ir label::after, &.toggle-4ir label~label::after`]: {
      boxShadow: `0 0 0 2px ${SupplyColor} inset`,
      backgroundColor: SupplyColor,
    },
    [`&.toggle-4ir input:not(:checked)+label::after`]: {
      backgroundColor: 'transparent',
    },
  },

  [`& .map-ui .level-wrap`]: {
    display: 'flex',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    padding: '0px',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },

  [`& .map-ui .level-1`]: {
    display: 'none',
    position: 'relative',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: '16px',
    margin: '16px',
    minWidth: '50%',
    minHeight: '230px',
    pointerEvents: 'all',
    filter: 'drop-shadow(0px 0px 5px #0008)',
    transform: 'translateZ(0px)',
    [`.ct-labels .ct-label.ct-horizontal`]: {opacity: 0},
  },

  [`& .map-ui .level-1.first-level`]: {
    [`.ct-grids`]: {display: 'none'},
    [`.ct-labels`]: {display: 'none'},
  },

  [`& .map-ui .level-1:last-child:not(.hidden)`]: {
    display: 'block',
  },

  [`& .map-ui .level-1:last-child:first-of-type`]: {
    display: 'block !important',
  },

  [`& .map-ui .level-1 h3`]: {
    margin: '0 0 16px 40px',
  },

  [`& .map-ui .level-1 .back-btn`]: {
    position: 'absolute',
    top: 5,
    left: 7,
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    [`&::before`]: {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 14,
      left: 16,
      width: '10px',
      height: '10px',
      border: '1px solid black',
      borderTop: 'none',
      borderRight: 'none',
      transform: 'rotate(45deg)',
    },
  },

  [`& .series-pager`]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  [`& .series-pager .series-name`]: {
    textAlign: 'center',
  },

  [`& .series-pager .back-btn`]: {
    position: 'relative',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    [`&::before`]: {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 14,
      left: 16,
      width: '10px',
      height: '10px',
      border: '1px solid black',
      borderTop: 'none',
      borderRight: 'none',
      transform: 'rotate(45deg)',
    },
  },

  [`& .series-pager .next-btn`]: {
    position: 'relative',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    [`&::before`]: {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 14,
      left: 16,
      width: '10px',
      height: '10px',
      border: '1px solid black',
      borderTop: 'none',
      borderRight: 'none',
      transform: 'rotate(225deg)',
    },
  },

  [`& .series-legend`]: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [`&>div`]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    [`&>div>div`]: {
      display: 'inline-block',
      width: '14px',
      height: '14px',
      borderRadius: '14px',
      marginRight: '10px',
      marginTop: '-3px',
    },
    [`&>div~div`]: {
      marginLeft: '40px',
    },
  },
  [`& .toggle-4ir+div`]: {
    marginTop: '48px',
  },
  [`&.graph-five-visible+p`]: {
    display: 'none',
  },
}));

const svgNS = 'http://www.w3.org/2000/svg';
const svgScale = 100;

const svgViewBox = `${svgScale * 87.9} ${-svgScale * 26.7} ${svgScale * 4.9} ${
  svgScale * 6.1
}`;

export const SVG = (tag = 'g', id = '') => {
  const el = document.createElementNS(svgNS, tag);
  if (id) {
    el.setAttributeNS(svgNS, 'id', id);
    el.setAttribute('id', id);
  }
  return el;
};

export const DIV = (className = '', id = '') => {
  const el = document.createElement('div');
  el.className = className;
  if (id) {
    el.setAttribute('id', id);
  }
  return el;
};

export const numberBN = (num: string | number | any) => {
  return ('' + num)
    .replace(/0/g, '০')
    .replace(/1/g, '১')
    .replace(/2/g, '২')
    .replace(/3/g, '৩')
    .replace(/4/g, '৪')
    .replace(/5/g, '৫')
    .replace(/6/g, '৬')
    .replace(/7/g, '৭')
    .replace(/8/g, '৮')
    .replace(/9/g, '৯');
};

export const centerPoint = ({x, y, width, height}: SVGRect) => ({
  x: x + width / 2,
  y: y + height / 2,
});

export const verticalLabel = (height = 360, label = '') => {
  const {x, y} = {x: 10, y: height / 2};
  const tx2 = new Chartist.Svg(
    'text',
    {
      x: 0,
      y: 0,
      'dominant-baseline': `middle`,
      'text-anchor': `middle`,
      style: `transform:translate(${x}px,${y + 8}px) rotate(-90deg);`,
      fill: 'rgba(0,0,0,.4)',
      'font-size': 12,
    },
    '',
  );
  tx2._node.innerHTML = label;
  return tx2;
};

export const createTipContext = (title = '') => {
  let tipElement: HTMLElement | null;

  const mousemoveCB = (e: any) => {
    // console.log('mousemove', e);
    if (tipElement) {
      tipElement.style.top = e?.y + 8 + 'px';
      tipElement.style.left = e?.x + 8 + 'px';
    }
  };

  const TIP = (element: HTMLElement, content: any) => {
    element.addEventListener('mouseenter', () => {
      if (tipElement) {
        tipElement.innerHTML = content;
        tipElement.style.display = 'block';
      }
    });
    element.addEventListener('mouseleave', () => {
      if (tipElement) {
        tipElement.innerHTML = '';
        tipElement.style.display = 'none';
      }
    });
  };

  const mount = () => {
    let elem: any = document.createElement('div');
    elem.className = '4px';
    elem.style.height = 'auto';
    elem.style.width = 'auto';
    elem.style.maxWidth = '300px';
    elem.style.padding = '8px 12px';
    elem.style.borderRadius = '4px';
    elem.style.backgroundColor = '#fff';
    elem.style.filter = 'drop-shadow(0px 0px 4px #888)';
    elem.style.transformOrigin = 'top left';
    elem.style.transform = 'scale(0.8) translateZ(0px)';
    elem.style.position = 'fixed';
    elem.style.left = '0px';
    elem.style.top = '-100px';
    elem.style.display = 'none';
    elem.style.zIndex = '999999';
    elem.style.pointerEvents = 'none';
    elem.id = 'tip-context-' + title;
    document.body.appendChild(elem);
    document.documentElement.addEventListener('mousemove', mousemoveCB);
    tipElement = elem;
    return tipElement;
  };

  const unmount = () => {
    if (tipElement) {
      tipElement.remove();
      document.documentElement.removeEventListener('mousemove', mousemoveCB);
      tipElement = null;
    }
  };

  const isMounted = () => {
    return !!tipElement;
  };

  return {TIP, mount, unmount, isMounted};
};

const {TIP, mount, unmount, isMounted} = createTipContext('mapview');

const GraphMapView = () => {
  const {messages, formatNumber} = useIntl();

  const [isEN, setIsEN] = useState(messages['common.jobs'] == 'Jobs');
  // const [isOpened, setIsOpened] = useState(false);
  // const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!isMounted()) mount();
    const link = document.createElement('div');
    link.innerHTML +=
      // @ts-ignore
      '<link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">';
    document.head.appendChild(link.children[0]);
    setIsEN(messages['common.jobs'] == 'Jobs');
    console.log('EFF >>', isEN);
    return () => {
      unmount();
    };
  }, [messages]);

  const deps = [messages, isEN, formatNumber];

  const graph1CB = useCallback((node) => {
    if (!node || node.children.length > 0) return;
    // console.clear();

    const defocusDistrict = () => {
      div.style.transform = 'none';
      setTimeout(() => {
        div.style.pointerEvents = 'all';
      }, 1100);
      L1Div.classList.add('hidden');
    };

    const focusDistrict = (e: MouseEvent) => {
      // @ts-ignore
      const g = e.target.parentElement;
      const forDemand = g.getAttribute('demand-district-name');
      const forSupply = g.getAttribute('supply-district-name');
      // @ts-ignore
      let district: string;
      if (forDemand) {
        district = forDemand;
      } else {
        district = forSupply;
      }
      // const box = g.getBBox();
      // const cen = centerPoint(box);
      const rc1 = div.getBoundingClientRect();
      const rc2 = g.getBoundingClientRect();
      const cnX = rc2.width / 2;
      const cnY = rc2.height / 2;
      const toX = rc2.left - rc1.left + cnX;
      const toY = rc2.top - rc1.top + cnY;
      const mvX = -toX + rc1.width / 2;
      const mvY = -toY + rc1.height / 2;

      div.style.transformOrigin = `${toX}px ${toY}px`;
      div.style.transform = `translate(${mvX}px,${mvY}px) rotateX(45deg) scale(${
        0.8 * Math.sqrt((rc1.width * rc1.height) / (rc2.width * rc2.height))
      })`;
      div.style.pointerEvents = 'none';

      L1DivTitle.innerHTML = `<h3>${
        // @ts-ignore
        isEN ? district.trim() : Districts[district.trim()]
      }</h3><div class="loader" style="
      "></div>`;

      //@ts-ignore
      const districtIdsObj = DistrictsIdsWithDivision[district.trim()];

      (async () => {
        try {
          const statisticsData = await getMapDataStatistics(
            districtIdsObj.district_id,
          );

          let html = `<h3>${
            // @ts-ignore
            isEN ? district.trim() : Districts[district.trim()]
          }</h3>
          <div style="display: flex; justify-content: space-between; padding: 0 20px 25px 20px">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100px; height: 100px; border-radius: 50%; background-color: #9e70a7; display: flex; justify-content: center; align-items: center;">
                    <span style="font-size: 30px; color: white;">${formatNumber(
                      statisticsData?.total_learner,
                    )}</span>
                </div>
                <span style="margin-top: 10px; font-weight: bold; font-size: 16px;">${
                  messages['statistics.total_users']
                }</span>
            </div>
            <a href=${'/jobs/?search_text=' + district.trim()}>
            <div style="display: flex; flex-direction: column; align-items: center;"
    >
                <div style="width: 100px; height: 100px; border-radius: 50%; background-color: #a5b7d4; display: flex; justify-content: center; align-items: center;" onmouseover="this.style.backgroundColor='#6284bb'" onmouseleave="this.style.backgroundColor='#a5b7d4'" >
                    <img src="/images/jobs/job-seeker.png" style="width: 50px; height: 50px; margin-left: 5px;"/>
                </div>
                <span style="margin-top: 10px; font-weight: bold; font-size: 16px; text-align: center">${
                  messages['statistics.click_to_view_total_jobs']
                }</span>
            </div>
            </a>
            <a href=${`${educDomain()}/skills?district=${
              districtIdsObj.district_id
            }`}>
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 100px; height: 100px; border-radius: 50%; background-color: #488c8c; display: flex; justify-content: center; align-items: center;">
                    <span style="font-size: 30px; color: white;">${formatNumber(
                      statisticsData?.total_course,
                    )}</span>
                </div>
                <span style="margin-top: 10px; font-weight: bold; font-size: 16px;">${
                  messages['common.total_skills']
                }</span>
            </div>
            </a>
        </div>
          `;

          L1DivTitle.innerHTML = html;
        } catch (error) {
          console.log('error->>', error);
          L1DivTitle.innerHTML = `<div style='text-align: center; font-size: 25px; font-weight: 600;'>${messages['common.no_data_found']}</div>`;
        }
      })();

      setTimeout(() => {
        L1Div.classList.remove('hidden');
      }, 1000);
    };

    const DemandTotals: any = {};
    const SupplyTotals: any = {};
    // const DemandMax = 23400;
    // const SupplyMax = 51200;

    for (let k in Districts) {
      DemandTotals[k] = 0;
      SupplyTotals[k] = 0;
      // @ts-ignore
      Object.keys(Demand[k]).forEach((ind: any) => {
        // @ts-ignore
        for (let occ in Demand[k][ind]) DemandTotals[k] += Demand[k][ind][occ];
      });
      // @ts-ignore
      Object.keys(Supply[k]).forEach((tss: any) => {
        // @ts-ignore
        for (let occ in Supply[k][tss]) SupplyTotals[k] += Supply[k][tss][occ];
      });
    }

    const div = DIV();
    div.className = 'map-svgs';
    node.appendChild(div);

    const UI = DIV();
    UI.className = 'map-ui';
    node.appendChild(UI);

    const svg1 = SVG('svg', 'demand-map');
    svg1.setAttribute('viewBox', svgViewBox);
    svg1.setAttribute('class', 'demand-map');
    div.appendChild(svg1);
    const G1 = SVG('g', 'top-group-1');
    svg1.appendChild(G1);

    const svg2 = SVG('svg', 'supply-map');
    svg2.setAttribute('viewBox', svgViewBox);
    svg2.setAttribute('class', 'supply-map hidden');
    div.appendChild(svg2);
    const G2 = SVG('g', 'top-group-2');
    svg2.appendChild(G2);

    const svg3 = SVG('svg', 'map-names');
    svg3.setAttribute('viewBox', svgViewBox);
    svg3.setAttribute('class', 'map-names');
    div.appendChild(svg3);
    const G3 = SVG('g', 'top-group-3');
    svg3.appendChild(G3);

    let learnerCountDistrictId: any = {};

    (async () => {
      try {
        const learnerData = await getDistrictWiseTotalYouth();
        let maxYouthCount = 0; // Initialize maxYouthCount variable

        learnerData.forEach((item: any) => {
          learnerCountDistrictId[item.loc_district_id] = item.learner_count;

          if (item.learner_count > maxYouthCount) {
            maxYouthCount = item.learner_count;
          }
        });

        const MapIndexed: any = {};
        Map.features.forEach((v) => {
          MapIndexed[v.properties.ADM2_EN] = v;
          if (v.geometry.type == 'MultiPolygon' && null) console.log('');

          const g1 = SVG('g');
          g1.setAttribute('demand-district-name', v.properties.ADM2_EN);
          G1.appendChild(g1);

          v.geometry.coordinates.forEach((c) => {
            // draw
            const poly = `<polygon points="${c
              .map((d: any) =>
                v.geometry.type != 'MultiPolygon'
                  ? [d[0] * svgScale, -d[1] * svgScale]
                  : d.map((p: Array<number>) => [
                      p[0] * svgScale,
                      -p[1] * svgScale,
                    ]),
              )
              .join(' ')}" />`;
            g1.innerHTML += poly;
          });
          g1.onpointerdown = focusDistrict;

          TIP(
            g1 as unknown as HTMLElement,
            isEN
              ? v.properties.ADM2_EN
              : Districts[v.properties.ADM2_EN as keyof typeof Districts],
          );

          g1.setAttribute(
            'opacity',
            `${
              0.2 +
              0.8 *
                (Math.min(
                  maxYouthCount,
                  learnerCountDistrictId[
                    DistrictsIds[
                      v.properties.ADM2_EN.trim() as keyof typeof DistrictsIds
                    ]
                  ] ?? 0,
                ) /
                  maxYouthCount)
            }`,
          );

          // @ts-ignore
          const center = centerPoint(g1.getBBox());
          G3.innerHTML += `<text
              x="${center.x}"
              y="${center.y}"
              dominant-baseline="middle"
              text-anchor="middle"
          >${
            // @ts-ignore
            isEN ? v.properties.ADM2_EN : Districts[v.properties.ADM2_EN]
          }</text>`;

          // remove supply map
          svg2.remove();
        });
      } catch (error) {
        learnerCountDistrictId = null;
        console.log('Error in fetching district wise learner count');
      }
    })();

    const Levels = DIV('level-wrap');
    UI.appendChild(Levels);

    const L1Div = DIV('level-1 first-level hidden');
    Levels.appendChild(L1Div);
    const L1DivTitle = DIV('level-title');
    L1Div.appendChild(L1DivTitle);
    L1DivTitle.innerHTML = `<h3>${''}</h3>`;
    const L1DivBtn = DIV('back-btn');
    L1Div.appendChild(L1DivBtn);
    L1DivBtn.onpointerdown = defocusDistrict;
    const L1DivChart = DIV('level-chart');
    L1Div.appendChild(L1DivChart);

    const dataSource = DIV('data-source');
    UI.appendChild(dataSource);
    dataSource.innerHTML =
      'Source: Unemployment Free District (UFD) Initiative of a2i & Field Administration';

    // setIsReady(true);
  }, deps);

  const graph1RefCB1 = useCallback(graph1CB, [graph1CB, messages, isEN]);
  const graph1RefCB2 = useCallback(graph1CB, [graph1CB, messages, isEN]);

  return (
    <StyledGrid container>
      <Container maxWidth='lg' disableGutters>
        <SectionTitle
          title={messages['common.graph_map_title'] as string}
          center={true}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {!isEN ? <StyledBox ref={graph1RefCB1} /> : null}
          {!isEN ? null : <StyledBox ref={graph1RefCB2} />}
        </Box>
      </Container>
    </StyledGrid>
  );
};
export default GraphMapView;
