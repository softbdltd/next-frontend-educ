import {AxiosInstance} from 'axios';
import MockAdapter from 'axios-mock-adapter';

export default function registerAxiosMockAdapter(axiosInstance: AxiosInstance) {
    // This sets the mock adapter on the default instance
    const mock = new MockAdapter(axiosInstance, {onNoMatch: 'throwException'});

    /**Industry**/
    // mock.onGet(API_INDUSTRY_PUBLICATIONS).reply(200, {data: publications});
    // mock.onGet(API_INDUSTRY_MEMBERS).reply(200, {data: members});
    // mock
    //   .onGet(new RegExp(API_INDUSTRY_MEMBERS + '/(.*)'))
    //   .reply(200, {data: members[0]});

    // Landing Page Popup
    // mock.onGet(API_PUBLIC_LANDING_PAGE_PROMOTION_BANNER_POPUP).reply(200, {
    //   data: {
    //     data: {
    //       content:
    //         '<h1><strong>New Job Opportunity at SoftBD</strong></h1>\n' +
    //         '<h4>Frontend Developer Needed</h4>\n' +
    //         '<p><img src="https://file.educ.com/uploads/DNieHQoRg6KB56zNE9yOpvpMysYIbq1668061453.jpg" alt="" width="600" height="400" /></p>',
    //     },
    //   },
    // });

    // //Put it on the bottom of that function
    mock.onAny().passThrough();
}