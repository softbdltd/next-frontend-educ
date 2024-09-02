import React, {useCallback, useEffect, useRef} from 'react';
import {Box, Container} from '@mui/material';
import Chartist from 'chartist';
import EmergingOccupations from '../../shared/json/EmergingOccupations.json';
import {useIntl} from 'react-intl';

import {
  classes,
  createTipContext,
  DIV,
  StyledBox,
  StyledGrid,
  verticalLabel,
} from './GraphMapView';
import {styled} from '@mui/material/styles';
import Slider from 'react-slick';
import {H6} from '../../@core/elements/common';

const StyledSlider = styled(Slider)(({theme}) => ({
  paddingBottom: '5px !important',
  borderRadius: '20px !important',
  '& .slick-dots button:before': {
    fontSize: '10px',
  },
  '& .slick-dots li.slick-active button:before': {
    opacity: '.75',
    color: theme.palette.primary.main,
  },
}));

const colors = ['#ed1c24', '#84a856', '#f9a867', '#00aeef', '#890adc'];

const {TIP, mount, unmount, isMounted} = createTipContext('graphview');

const GraphView = ({autoPlay}: any) => {
  const {messages} = useIntl();
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    if (!isMounted()) mount();
    const link = document.createElement('div');
    link.innerHTML +=
      // @ts-ignore
      '<link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">';
    document.head.appendChild(link.children[0]);
    return () => {
      unmount();
    };
  }, []);

  useEffect(() => {
    if (autoPlay) {
      play();
    } else {
      pause();
    }
  }, [autoPlay]);

  const play = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  };

  const pause = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPause();
    }
  };

  const graph2RefCB = useCallback((node) => {
    if (!node || node.children.length > 0) return;

    const div = DIV();
    div.className = '';
    node.appendChild(div);
    const labels = [
      `Actual & \nTrend Analysis`,
      `Estimated (with \n10% Growth Rate)`,
      `Estimated (with \n20% Growth Rate)`,
      `Estimated (with \n30% Growth Rate)`,
    ];
    let didDrawVerticalLabel = false;

    new Chartist.Line(
      div,
      {
        labels: [2022, 2023, 2024, 2025, 2026, 2027],
        series: [
          [1088415, 1046900, 1046904, 1087006, 1100330, 1106273],
          [1175664, 1137768, 1154724, 1181977, 1195971, 1201904],
          [1282542, 1241202, 1241202, 1289429, 1304695, 1304695],
          [1389421, 1344635, 1364674, 1396882, 1413420, 1420432],
        ],
      },
      {
        // fullWidth: true,
        chartPadding: {
          // right: 60,
          left: 38,
          top: 20,
          bottom: 5,
        },
        // height: '360px',
        // low: 100000,
        // showArea: true,
        height: '352px',
        // width: '100%',
      },
    ).on('draw', (data: any) => {
      // console.log('DRAW >>', data.type, data);
      if (data.type === 'label' && !didDrawVerticalLabel) {
        data.group.append(verticalLabel(352 - 50, `Number of Job Demand`));
        didDrawVerticalLabel = true;
      }
      if (data.type === 'point') {
        // console.log('point', data);
        data.element.attr({
          style: `stroke: ${colors[data.seriesIndex]};`,
        });
        const cir = new Chartist.Svg(
          'circle',
          {
            cx: data.x,
            cy: data.y,
            r: 25,
            style: `fill:transparent;`,
          },
          '',
        );
        data.group.append(cir);
        TIP(cir._node, data.series[data.index]);
        TIP(data.element._node, data.series[data.index]);
      }
      if (data.type === 'line') {
        // console.log(data);
        data.element.attr({
          style: `stroke: ${colors[data.seriesIndex]}; cursor:auto;`,
        });
        data.element._node.onclick = () => {};
        const txt = new Chartist.Svg(
          'text',
          {
            x: `${data.path.pathElements[5].x + 10}`,
            y: `${data.path.pathElements[5].y - 10}`,
            'dominant-baseline': `middle`,
            // 'text-anchor': `middle`,
            // fill: data.element._node.getAttribute('stroke'),
            fill: 'rgba(0,0,0,.4)',
            'font-size': 12,
          },
          '',
        );
        txt._node.innerHTML = labels[data.seriesIndex].split('\n')[0];
        data.group.append(txt);
        const txt2 = new Chartist.Svg(
          'text',
          {
            x: `${data.path.pathElements[5].x + 10}`,
            y: `${data.path.pathElements[5].y + 10}`,
            'dominant-baseline': `middle`,
            fill: 'rgba(0,0,0,.4)',
            'font-size': 12,
          },
          '',
        );
        txt2._node.innerHTML = labels[data.seriesIndex].split('\n')[1];
        data.group.append(txt2);
      }
    });
  }, []);

  const graph3RefCB = useCallback((node) => {
    if (!node || node.children.length > 0) return;

    const pager = DIV();
    pager.className = 'series-pager';
    node.appendChild(pager);
    pager.innerHTML = `
      <div class='back-btn'></div>
      <div class='series-name'></div>
      <div class='next-btn'></div>
    `;

    const div = DIV();
    div.className = '';
    node.appendChild(div);

    let currentPage = 0;
    const emgOccSectors = Object.keys(EmergingOccupations);

    pager.children[1].innerHTML = `(${currentPage + 1}/${
      emgOccSectors.length
    }) ${emgOccSectors[currentPage]}`;

    // @ts-ignore
    pager.children[0].onclick = () => {
      currentPage--;
      currentPage = currentPage < 0 ? emgOccSectors.length - 1 : currentPage;
      pager.children[1].innerHTML = `(${currentPage + 1}/${
        emgOccSectors.length
      }) ${emgOccSectors[currentPage]}`;
      paginate(emgOccSectors[currentPage]);
    };

    // @ts-ignore
    pager.children[2].onclick = () => {
      currentPage++;
      currentPage = currentPage % emgOccSectors.length;
      pager.children[1].innerHTML = `(${currentPage + 1}/${
        emgOccSectors.length
      }) ${emgOccSectors[currentPage]}`;
      paginate(emgOccSectors[currentPage]);
    };

    const paginate = (pageName: any) => {
      // @ts-ignore
      const dataLabels = Object.keys(EmergingOccupations[pageName]);
      // @ts-ignore
      const dataSeries = Object.values(EmergingOccupations[pageName]);
      let didDrawVerticalLabel = false;
      // @ts-ignore
      new Chartist.Bar(
        div,
        {
          labels: dataLabels,
          // @ts-ignore
          series: [dataSeries], //dataLabels.map((k) => Object.values(EmergingOccupations[k])),
        },
        {
          // fullWidth: true,
          chartPadding: {
            // bottom: 250,
            // right: 20,
            left: 25,
            top: 25,
          },
          // height: '360px', // '520px',
          // Default mobile configuration
          height: '313px',
          stackBars: false,
          axisX: {
            showLabel: false,
          },
          // reverseData: false,
          horizontalBars: false,
          // seriesBarDistance: 15,
        },
      ).on('draw', (data: any) => {
        // console.log('DRAW >>', data.type);
        if (data.type === 'label' && !didDrawVerticalLabel) {
          data.group.append(verticalLabel(313 - 50, `Number of Job Demand`));
          didDrawVerticalLabel = true;
        }
        if (data.type === 'bar') {
          // console.log('bar', data);
          data.element.attr({
            style: `stroke-width: 2px; cursor:auto; stroke:${
              colors[data.index % colors.length]
            };`,
          });

          const lin = new Chartist.Svg(
            'rect',
            {
              x: data.x2 - 15,
              y: data.y2,
              width: 30,
              height: data.y1 - data.y2,
              style: `stroke-width:0px; fill:transparent;`,
            },
            '',
          );
          data.group.append(lin);

          const cir = new Chartist.Svg(
            'circle',
            {
              cx: data.x2,
              cy: data.y2,
              r: 22,
              style: `fill:${colors[data.index % colors.length]};`,
            },
            '',
          );
          data.group.append(cir);

          const txt = new Chartist.Svg(
            'text',
            {
              x: `${data.x2}`,
              y: `${data.y2 + 1}`,
              'dominant-baseline': `middle`,
              'text-anchor': `middle`,
              style: `cursor:auto;`,
              fill: '#fff',
              'font-size': 10,
            },
            '',
          );
          txt._node.innerHTML = data.value.y;
          data.group.append(txt);

          /*
          const {x1, y1} = data;
          const tx2 = new Chartist.Svg(
            'text',
            {
              x: 0, // `${data.x1}`,
              y: 0, // `${data.y1 + 5}`,
              'dominant-baseline': `middle`,
              'text-anchor': `start`,
              style: `transform:translate(${x1}px,${y1 + 8}px) rotate(90deg);`,
              fill: 'rgba(0,0,0,.4)',
              'font-size': 12,
            },
            '',
          );
          tx2._node.innerHTML = dataLabels[data.index];
          data.group.append(tx2);
          */

          TIP(data.element._node, dataLabels[data.index]);
          TIP(lin._node, dataLabels[data.index]);
          TIP(cir._node, dataLabels[data.index]);
          TIP(txt._node, dataLabels[data.index]);
          // TIP(tx2._node, dataLabels[data.index]);
        }
      });
    };
    paginate(Object.keys(EmergingOccupations)[currentPage]);
  }, []);

  // const graph4RefCB = useCallback((node) => {
  //   if (!node || node.children.length > 0) return;
  //
  //   let checked5th = false;
  //   const toggleDS = DIV('toggle-4ir');
  //   node.appendChild(toggleDS);
  //   toggleDS.innerHTML = `
  //       <input type="radio" id="graph_type_toggle_fourth_4" name="graph_type_toggle_4" checked />
  //       <label for="graph_type_toggle_fourth_4">Future Occupations (Research Data)</label>
  //       <input type="radio" id="graph_type_toggle_fifth_4" name="graph_type_toggle_4" />
  //       <label for="graph_type_toggle_fifth_4">Future Occupations (Real-time Data)</label>
  //     `;
  //   toggleDS.onclick = () => {
  //     // @ts-ignore
  //     if (checked5th && toggleDS?.children?.[0]?.checked) {
  //       node.children[2].remove();
  //       node.children[1].remove();
  //       node.classList.remove('graph-five-visible');
  //       graph4();
  //       // @ts-ignore
  //     } else if (!checked5th && toggleDS?.children?.[2]?.checked) {
  //       node.children[2].remove();
  //       node.children[1].remove();
  //       node.classList.add('graph-five-visible');
  //       graph5();
  //     }
  //     // @ts-ignore
  //     checked5th = toggleDS?.children?.[2]?.checked;
  //   };
  //
  //   const graphData = {
  //     'Senior Manager: ICT': [116, 243, 321],
  //     'ICT Officer': [125, 236, 359],
  //     Engineer: [131, 306, 423],
  //     'Production Staff': [264, 407, 654],
  //     'Machine operator': [173, 311, 489],
  //     'Production Officer': [164, 368, 521],
  //     'Manager: Instrumentation': [211, 462, 637],
  //     'Assistant Manager': [172, 397, 598],
  //     'Factory Manager': [143, 268, 453],
  //     Chemist: [97, 167, 213],
  //     Supervisor: [107, 241, 299],
  //     'Officer: Admin': [177, 355, 419],
  //   };
  //   const dataYears = [2023, 2024, 2025];
  //   const dataLabels = Object.keys(graphData);
  //   // @ts-ignore
  //   const dataGroups = [new Array(), new Array(), new Array()];
  //   Object.values(graphData).forEach((v) => {
  //     dataGroups[0].push(v[0]);
  //     dataGroups[1].push(v[1]);
  //     dataGroups[2].push(v[2]);
  //   });
  //
  //   const graph4Section = (
  //     index: number,
  //     div: HTMLElement,
  //     series: any,
  //     title = '',
  //     jobs = '',
  //     gray = false,
  //   ) => {
  //     const wrap = DIV();
  //     wrap.style.flex = '111';
  //     wrap.style.backgroundColor = gray ? '#f0f0f0' : '#f8f8f8';
  //     div.appendChild(wrap);
  //
  //     const ttl = DIV();
  //     wrap.appendChild(ttl);
  //     ttl.style.padding = '8px';
  //     ttl.style.textAlign = 'center';
  //     ttl.style.fontWeight = 'bold';
  //     ttl.style.marginTop = gray ? '80px' : '10px';
  //     ttl.innerHTML = title;
  //
  //     const sec = DIV();
  //     wrap.appendChild(sec);
  //
  //     new Chartist.Pie(
  //       sec,
  //       {
  //         series,
  //       },
  //       {
  //         donut: true,
  //         donutWidth: 40,
  //         donutSolid: true,
  //         startAngle: 0,
  //         showLabel: false,
  //         height: '190px',
  //       },
  //     ).on('draw', (data: any) => {
  //       if (data.type === 'slice') {
  //         // console.log('slice', data);
  //         data.element.attr({
  //           style: `fill: ${data.index === 0 ? colors[index] : '#bbb'};`,
  //         });
  //         if (data.index === 0) {
  //           const txt = new Chartist.Svg(
  //             'text',
  //             {
  //               x: 190 / 2,
  //               y: 190 / 2,
  //               'dominant-baseline': `middle`,
  //               'text-anchor': `middle`,
  //               style: `cursor:auto;`,
  //               fill: colors[index],
  //               'font-size': 44,
  //             },
  //             '',
  //           );
  //           txt._node.innerHTML = series[0] + '%';
  //           data.group.append(txt);
  //
  //           const txt2 = new Chartist.Svg(
  //             'text',
  //             {
  //               x: 190 / 2,
  //               y: 190 / 2 + 30,
  //               'dominant-baseline': `middle`,
  //               'text-anchor': `middle`,
  //               style: `cursor:auto;`,
  //               fill: colors[index],
  //               'font-size': 14,
  //             },
  //             '',
  //           );
  //           txt2._node.innerHTML = 'At Risk';
  //           data.group.append(txt2);
  //         }
  //       }
  //     });
  //
  //     const con = DIV();
  //     wrap.appendChild(con);
  //     con.style.padding = '8px';
  //     con.style.textAlign = 'left';
  //     con.style.color = colors[index];
  //     con.innerHTML =
  //       `Emerging 🠗<br/>` +
  //       jobs
  //         .split(', ')
  //         .map((s) => '⦿ ' + s)
  //         .join('<br/>');
  //   };
  //
  //   const graph4 = () => {
  //     const div = DIV();
  //     div.className = '';
  //     div.style.display = 'flex';
  //     node.appendChild(div);
  //
  //     const data: Array<Array<any>> = [
  //       [
  //         `RMG & Textiles`,
  //         60,
  //         `3D printer operator, Workers with skills on automation and robotics control experts on modeling and simulation`,
  //       ],
  //       [
  //         `Furniture`,
  //         60,
  //         `Ready-to-Assemble (RTA) designer, Industrial robotics control`,
  //       ],
  //       [
  //         `Agro-Food`,
  //         40,
  //         `Food technologists, Machinery Maintenance, Automate packaging operator, Industrial robotics control`,
  //       ],
  //       [
  //         `Leather`,
  //         35,
  //         `Footwear design simulation, CAD CAM Training, Pattern Making`,
  //       ],
  //       [
  //         `Tourism & Hospitality`,
  //         20,
  //         `Digital marketing, Data analytics, Cyber security`,
  //       ],
  //     ];
  //
  //     graph4Section(
  //       0,
  //       div,
  //       [data[0][1], 100 - data[0][1]],
  //       data[0][0],
  //       data[0][2],
  //     );
  //     graph4Section(
  //       1,
  //       div,
  //       [data[1][1], 100 - data[1][1]],
  //       data[1][0],
  //       data[1][2],
  //       true,
  //     );
  //     graph4Section(
  //       2,
  //       div,
  //       [data[2][1], 100 - data[2][1]],
  //       data[2][0],
  //       data[2][2],
  //     );
  //     graph4Section(
  //       3,
  //       div,
  //       [data[3][1], 100 - data[3][1]],
  //       data[3][0],
  //       data[3][2],
  //       true,
  //     );
  //     graph4Section(
  //       4,
  //       div,
  //       [data[4][1], 100 - data[4][1]],
  //       data[4][0],
  //       data[4][2],
  //     );
  //
  //     const con = DIV();
  //     con.className = '';
  //     node.appendChild(con);
  //   };
  //
  //   const graph5 = () => {
  //     const div = DIV();
  //     div.className = '';
  //     node.appendChild(div);
  //
  //     const legends = DIV();
  //     legends.className = 'series-legend';
  //     node.appendChild(legends);
  //     legends.innerHTML = `
  //       <div><div style="background: ${colors[0]};"></div> ${dataYears[0]}</div>
  //       <div><div style="background: ${colors[1]};"></div> ${dataYears[1]}</div>
  //       <div><div style="background: ${colors[2]};"></div> ${dataYears[2]}</div>
  //     `;
  //     let didDrawVerticalLabel = false;
  //
  //     new Chartist.Bar(
  //       div,
  //       {
  //         labels: Object.keys(graphData),
  //         series: dataGroups, //Object.values(graphData),
  //       },
  //       {
  //         // fullWidth: true,
  //         stackBars: false,
  //         chartPadding: {
  //           right: 10,
  //           left: 10,
  //         },
  //         height: '360px',
  //         // low: 100000,
  //         // showArea: true,
  //       },
  //     ).on('draw', (data: any) => {
  //       if (data.type === 'label' && !didDrawVerticalLabel) {
  //         data.group.append(verticalLabel(360 - 50, `Number of Occupations`));
  //         didDrawVerticalLabel = true;
  //       }
  //       if (data.type === 'bar') {
  //         // console.log(data);
  //         data.element.attr({
  //           style: `stroke-width: 10px; cursor:auto; stroke:${
  //             colors[data.seriesIndex % colors.length]
  //           };`,
  //         });
  //
  //         const txt = new Chartist.Svg(
  //           'text',
  //           {
  //             x: `${data.x2}`,
  //             y: `${data.y2 - 7}`,
  //             'dominant-baseline': `middle`,
  //             'text-anchor': `middle`,
  //             style: `cursor:auto;`,
  //             fill: `${colors[data.seriesIndex % colors.length]}`,
  //             'font-size': 12,
  //           },
  //           '',
  //         );
  //         txt._node.innerHTML = data.value.y;
  //         data.group.append(txt);
  //
  //         TIP(
  //           data.element._node,
  //           `${dataLabels[data.index]} (${dataYears[data.seriesIndex]})`,
  //         );
  //         TIP(
  //           txt._node,
  //           `${dataLabels[data.index]} (${dataYears[data.seriesIndex]})`,
  //         );
  //       }
  //     });
  //   };
  //
  //   graph4();
  // }, []);

  const renderCustomPagination = (i: number) => {
    const pageNumber = i + 1;
    return (
      <button tabIndex={0} aria-label={`Go to slider ${pageNumber}`}>
        {pageNumber}
      </button>
    );
  };

  const settings = {
    customPaging: renderCustomPagination,
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <StyledGrid container xl={12}>
      <Container maxWidth='lg' disableGutters>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          {/** navigation bar */}
          <Box
            className={classes.TabPanelBox}
            tabIndex={0}
            role={'heading'}
            aria-label={`${messages['common.statistics']} ${messages['common.sliders']}`}>
            <StyledSlider ref={sliderRef} {...settings}>
              <Box>
                <H6
                  tabIndex={0}
                  role={'heading'}
                  aria-label={`${messages['common.graph_1']} graph chart`}
                  pb={1}
                  textAlign={'center'}>
                  {messages['common.graph_1']}
                </H6>
                <StyledBox aria-hidden={true} ref={graph2RefCB} />
                {/*<Body1 sx={{fontSize: '12px !important', mt: 4}} centered>*/}
                {/*  Source: {sources[0]}*/}
                {/*</Body1>*/}
              </Box>
              <Box>
                <H6
                  aria-label={`${messages['common.graph_2']} graph chart`}
                  role={'heading'}
                  tabIndex={0}
                  pb={1}
                  textAlign={'center'}>
                  {messages['common.graph_2']}
                </H6>
                <StyledBox aria-hidden={true} ref={graph3RefCB} />
              </Box>
            </StyledSlider>
          </Box>
        </Box>
      </Container>
    </StyledGrid>
  );
};
export default GraphView;
