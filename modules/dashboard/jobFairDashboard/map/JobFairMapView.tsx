import React, {useCallback, useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import {localizedNumbers} from '../../../../@core/utilities/helpers';
import Districts from '../../../../shared/json/Districts.json';
import Map from '../../../../shared/json/Map.json';
import {useIntl} from 'react-intl';
import DistrictsIds from '../../../../shared/json/DistrictsIds.json';
import {useFetchDistrictWiseJobFair} from '../../../../services/cmsManagement/hooks';
import {getConstituencyWiseJobFair} from '../../../../services/cmsManagement/DashboardService';

const MapFillColor = 'rgb(36,141,36)';

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

export const StyledRootBox = styled(Box)(({theme}) => ({
  marginTop: '40px',

  [`& .${classes.mapButtonGroup}`]: {
    border: '1px solid #eee',
    borderRadius: '5px',
    boxShadow: theme.shadows[3],
    marginBottom: '29px',
    width: '100%',
    maxWidth: '610px',
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
    border: '1px solid #eee',
    borderRadius: '2px',
    backgroundColor: theme.palette.grey[50],
    minHeight: '450px',
    width: '100%',
  },

  [`& .${classes.TabPanelBox}>div:not([hidden])`]: {
    width: '100%',
    height: '100%',
    minHeight: '480px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  [`& .${classes.TabPanelBox}>div>div`]: {
    width: '100%',
    maxWidth: '640px',
  },
}));

export const StyledBox = styled(Box)(() => ({
  border: '2px solid #d3d4d4',
  background: '#fff',
  padding: 20,
  perspective: '1000px',
  overflow: 'hidden',
  maxWidth: '750px',
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

  [`& .map-svgs svg.fair-map polygon`]: {
    fill: MapFillColor,
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
      boxShadow: `0 0 0 2px ${MapFillColor} inset`,
      backgroundColor: MapFillColor,
    },
    [`& label~label`]: {
      marginLeft: '16px',
    },
    [`& input:not(:checked)+label::after`]: {
      backgroundColor: 'transparent',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '16px',
    margin: '16px',
    minWidth: '70%',
    minHeight: '280px',
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
    margin: '0 0 10px 30px',
    fontSize: '28px',
  },

  [`& .map-ui .level-1 .back-btn`]: {
    position: 'absolute',
    top: 20,
    left: 7,
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    [`&::before`]: {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 10,
      left: 16,
      width: '10px',
      height: '10px',
      border: '1px solid black',
      borderTop: 'none',
      borderRight: 'none',
      transform: 'rotate(45deg)',
    },
  },
  [`& .map-ui .level-1 .level-stat`]: {
    maxHeight: '435px',
    overflowY: 'auto',
    [`& .statLabel`]: {
      fontWeight: 'bold',
      fontSize: '22px',
      color: '#3c3c3c',
    },
    [`& .statBlock`]: {
      display: 'flex',
      marginTop: '10px',
      [`&:not(:last-of-type)`]: {
        marginBottom: '20px',
      },
    },
    [`& .statBlock .blockItem`]: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 15%',
    },
    [`& .statBlock .blockItem .itemValue`]: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '22px',
    },
    [`& .statBlock .blockItem .itemLabel`]: {
      textAlign: 'center',
      color: '#8e8e8e',
      fontSize: '18px',
      lineHeight: '1.4',
      margin: '0px 5px',
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

export const createTipContext = (title = '') => {
  let tipElement: HTMLElement | null;

  const mousemoveCB = (e: any) => {
    if (tipElement) {
      tipElement.style.top = e?.y + 8 + 'px';
      tipElement.style.left = e?.x + 8 + 'px';
    }
  };

  const TIP = (element: HTMLElement, content: any) => {
    element.addEventListener('mouseenter', () => {
      // console.log('ENTER',tipElement?.style.display);
      if (tipElement) {
        tipElement.innerHTML = content;
        tipElement.style.display = 'block';
      }
    });
    element.addEventListener('mouseleave', () => {
      // console.log('exit',tipElement?.style.display);
      if (tipElement) {
        tipElement.innerHTML = '';
        tipElement.style.display = 'none';
      }
    });
  };

  const mount = () => {
    // console.log('MOUNTING CONTEXT: '+title);
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

const JobFairMapView = ({setFilterState}: any) => {
  const {messages} = useIntl();
  const [jobFilterState, setJobFilterState] = useState({});
  const {data: jobFairStats, isLoading: isLoadingJobFairStats} =
    useFetchDistrictWiseJobFair();

  const [isEN, setIsEN] = useState(messages['common.jobs'] == 'Jobs');
  const [maxMinData, setMaxMinData] = useState<any>({
    max: 0,
    min: 0,
  });

  useEffect(() => {
    if (!isMounted()) mount();
    setIsEN(messages['common.jobs'] == 'Jobs');
    return () => {
      unmount();
    };
  }, [messages, jobFairStats]);

  useEffect(() => {
    if (jobFairStats) {
      let obj = {
        max: 0,
        min: 0,
      };
      jobFairStats.map((item: any) => {
        if (item.total_fair_registered_learners) {
          if (Number(item.total_fair_registered_learners) > obj.max) {
            obj.max = Number(item.total_fair_registered_learners);
          }

          if (Number(item.total_fair_registered_learners) < obj.min) {
            obj.min = Number(item.total_fair_registered_learners);
          }
        }
      });

      setMaxMinData(obj);
    }
  }, [jobFairStats]);

  useEffect(() => {
    const button = document.getElementById('total_participating_institutions');
    if (button) {
      button.addEventListener('click', () => setFilterState(jobFilterState));
    }
  }, [jobFilterState]);

  const graph1CB = useCallback(
    (node) => {
      if (!node || node.children.length > 0) return;

      const defocusDistrict = () => {
        div.style.transform = 'none';
        setTimeout(() => {
          div.style.pointerEvents = 'all';
        }, 1100);
        L1Div.classList.add('hidden');
      };

      const focusDistrict = (e: MouseEvent) => {
        console.log(e);
        // @ts-ignore
        const g = e.target.parentElement;
        const districtName = g.getAttribute('fair-district-name');

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
          isEN ? districtName.trim() : Districts[districtName.trim()]
        } <br></h3>`;

        // @ts-ignore
        const selectedDistrictId = DistrictsIds[districtName.trim()];

        (async () => {
          try {
            const constituenciesData = await getConstituencyWiseJobFair({
              loc_district_id: selectedDistrictId,
            });
            let html = '';
            (constituenciesData || []).map((constituency: any) => {
              const value = {
                total_participating_institutions:
                  constituency.total_participating_institutions ?? 0,
                total_fair_registered_learners:
                  constituency.total_fair_registered_learners ?? 0,
                total_jobs_demand: constituency.total_jobs_demand ?? 0,
                total_jobs_provided: constituency.total_jobs_provided ?? 0,
                total_male: constituency.total_fair_registered_male ?? 0,
                total_female: constituency.total_fair_registered_female ?? 0,
              };
              if (value) {
                let obj_state = {
                  district_id: constituency?.loc_district_id,
                  constituency_id: constituency?.constituency_id,
                  division_id: constituency?.loc_division_id,
                };
                setJobFilterState(obj_state);
              }

              html += `<label class='statLabel'>${
                isEN
                  ? constituency.constituency_name_en ??
                    constituency.constituency_name
                  : constituency.constituency_name
              }</label><div class='statBlock'>
              <div class='blockItem' style='flex-basis: 17%'>
                <span class='itemValue' id='total_participating_institutions' style='color: #ae3fb8; cursor: pointer' ">${
                  isEN
                    ? value.total_participating_institutions
                    : numberBN(value.total_participating_institutions)
                }</span>
                <span class='itemLabel' >${
                  messages['job_fair_dashboard.participated_institutes']
                }</span>
              </div>
              <div class='blockItem' style='flex-basis: 20%'>
                <span class='itemValue' style='color: #4162d6'>${
                  isEN
                    ? value.total_fair_registered_learners
                    : numberBN(value.total_fair_registered_learners)
                }</span>
                <span class='itemLabel' >${
                  messages['job_fair_dashboard.registered_learners_in_fair']
                }</span>
              </div>
              <div class='blockItem'>
                <span class='itemValue' style='color: #1ec7bc'>${
                  isEN
                    ? value.total_jobs_demand
                    : numberBN(value.total_jobs_demand)
                }</span>
                <span class='itemLabel' >${
                  messages['job_fair_dashboard.job_demand']
                }</span>
              </div>
              <div class='blockItem' style='flex-basis: 18%'>
                <span class='itemValue' style='color: #fd9259'>${
                  isEN
                    ? value.total_jobs_provided
                    : numberBN(value.total_jobs_provided)
                }</span>
                <span class='itemLabel' >${
                  messages['job_fair_dashboard.job_provided_info']
                }</span>
              </div>
              <div class='blockItem'>
                <span class='itemValue' style='color: #26a426'>${
                  isEN ? value.total_male : numberBN(value.total_male)
                }</span>
                <span class='itemLabel' >${
                  messages['job_fair_dashboard.total_male']
                }</span>
              </div>
              <div class='blockItem'>
                <span class='itemValue' style='color: #f64848'>${
                  isEN ? value.total_female : numberBN(value.total_female)
                }</span>
                <span class='itemLabel' >${
                  messages['job_fair_dashboard.total_female']
                }</span>
              </div>
            </div>`;
            });

            if (html == '') {
              html = `<div style='text-align: center; font-size: 25px; font-weight: 600;'>${messages['common.no_data_found']}</div>`;
            }

            L1DivTable.innerHTML = html;
          } catch (error) {
            console.log('error->>', error);
            L1DivTable.innerHTML = `<div style='text-align: center; font-size: 25px; font-weight: 600;'>${messages['common.no_data_found']}</div>`;
          }
        })();

        setTimeout(() => {
          L1Div.classList.remove('hidden');
        }, 1000);
      };

      const totalRegisteredYouths: any = {};

      for (let k in Districts) {
        // @ts-ignore
        const districtId = DistrictsIds[k.trim()];
        const filtered = (jobFairStats || []).filter(
          (dis: any) => dis.id == districtId,
        );
        totalRegisteredYouths[k] = 0;
        if (filtered.length > 0) {
          totalRegisteredYouths[k] = filtered[0].total_fair_registered_learners
            ? Number(filtered[0].total_fair_registered_learners)
            : 0;
        }
      }

      const div = DIV();
      div.className = 'map-svgs';
      node.appendChild(div);

      const UI = DIV();
      UI.className = 'map-ui';
      node.appendChild(UI);

      const svg1 = SVG('svg', 'fair-map');
      svg1.setAttribute('viewBox', svgViewBox);
      svg1.setAttribute('class', 'fair-map');
      div.appendChild(svg1);
      const G1 = SVG('g', 'top-group-1');
      svg1.appendChild(G1);

      const svg3 = SVG('svg', 'map-names');
      svg3.setAttribute('viewBox', svgViewBox);
      svg3.setAttribute('class', 'map-names');
      div.appendChild(svg3);
      const G3 = SVG('g', 'top-group-3');
      svg3.appendChild(G3);

      const MapIndexed: any = {};
      Map.features.forEach((v: any) => {
        MapIndexed[v.properties.ADM2_EN] = v;

        const g1 = SVG('g');
        g1.setAttribute('fair-district-name', v.properties.ADM2_EN);
        G1.appendChild(g1);

        v.geometry.coordinates.forEach((c: any) => {
          // draw
          const poly = `<polygon points='${c
            .map((d: any) =>
              v.geometry.type != 'MultiPolygon'
                ? [d[0] * svgScale, -d[1] * svgScale]
                : d.map((p: Array<number>) => [
                    p[0] * svgScale,
                    -p[1] * svgScale,
                  ]),
            )
            .join(' ')}' />`;
          g1.innerHTML += poly;
        });
        g1.onpointerdown = focusDistrict;

        // @ts-ignore
        TIP(g1, isEN ? v.properties.ADM2_EN : Districts[v.properties.ADM2_EN]);
        // @ts-ignore
        g1.setAttribute(
          'opacity',
          `${
            0.2 +
            0.8 *
              (Math.min(5000, totalRegisteredYouths[v.properties.ADM2_EN]) /
                5000)
          }`,
        );
        // @ts-ignore
        const center = centerPoint(g1.getBBox());
        G3.innerHTML += `<text
          x='${center.x}'
          y='${center.y}'
          dominant-baseline='middle'
          text-anchor='middle'
      >${
        // @ts-ignore
        isEN ? v.properties.ADM2_EN : Districts[v.properties.ADM2_EN]
      }</text>`;
      });

      const Levels = DIV('level-wrap');
      UI.appendChild(Levels);

      const L1Div = DIV('level-1 first-level hidden');
      Levels.appendChild(L1Div);
      const L1DivTitle = DIV('level-title');
      L1Div.appendChild(L1DivTitle);
      L1DivTitle.innerHTML = `<h3></h3>`;
      const L1DivBtn = DIV('back-btn');
      L1Div.appendChild(L1DivBtn);
      L1DivBtn.onpointerdown = defocusDistrict;
      const L1DivTable = DIV('level-stat');
      L1Div.appendChild(L1DivTable);

      const dataSource = DIV('data-source');
      UI.appendChild(dataSource);
      dataSource.innerHTML =
        'Source: Unemployment Free District (UFD) Initiative of a2i & Field Administration';
    },
    [messages, isEN, jobFairStats],
  );

  const graph1RefCB1 = useCallback(graph1CB, [graph1CB, messages, isEN]);
  const graph1RefCB2 = useCallback(graph1CB, [graph1CB, messages, isEN]);

  return (
    <StyledRootBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        padding: '15px',
        borderRadius: '10px',
        maxWidth: '780px',
        boxShadow: '0px 2px 5px 5px #e9e9e9',
        position: 'relative',
      }}>
      <Box fontWeight='fontWeightBold' sx={{fontSize: '25px'}}>
        {messages['map.map_wise']}
      </Box>
      {isLoadingJobFairStats ? (
        <StyledBox>
          <Box
            sx={{
              height: '640px',
              display: 'flex',
              fontSize: '20px',
              fontWeight: '600',
              color: '#5b5b5b',
            }}>
            <span style={{margin: 'auto'}}>
              {messages['common.loading_data']}
            </span>
          </Box>
        </StyledBox>
      ) : (
        <>
          <>{ColorGradingWithValue(maxMinData)}</>
          {!isEN ? <StyledBox ref={graph1RefCB1} /> : null}
          {!isEN ? null : <StyledBox ref={graph1RefCB2} />}
        </>
      )}
    </StyledRootBox>
  );
};

const ColorGradingWithValue = (maxMinData: any) => {
  const {locale} = useIntl();

  const separator = 6;
  const segmentSize: number = Math.ceil(
    (maxMinData.max - maxMinData.min) / separator,
  );

  const valsArr = [...Array(separator)].map((val, index) =>
    Math.ceil(maxMinData.max - segmentSize * index),
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'absolute',
        zIndex: '1',
        right: '25px',
        top: '65px',
      }}>
      <Box
        sx={{
          display: 'flex',
          border: '1px solid #999',
        }}>
        {valsArr.map((val: number, index: number) => (
          <Typography
            component={'span'}
            sx={{
              width: '55px',
              height: '30px',
              display: 'block',
              background: '#248d24',
              opacity: `${0.2 + 0.8 * Math.min(5000, val / 5000)}`,
              borderRight: '1px solid #8d8d8d',
            }}
            key={index}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: 'block',
          marginTop: '-5px',
          [`& span:last-of-type`]: {width: '4px'},
        }}>
        {[...valsArr, 0].map((val: number, index: number) => (
          <Typography
            component={'span'}
            sx={{
              width: '56px',
              height: '30px',
              display: 'inline-block',
              fontSize: '0.7rem !important',
            }}
            key={index}>
            {localizedNumbers(val, locale)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default JobFairMapView;
