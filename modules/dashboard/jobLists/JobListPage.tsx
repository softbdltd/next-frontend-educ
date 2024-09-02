import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {
  API_JOBS,
  API_PUBLIC_OCCUPATIONS,
  API_PUBLIC_JOB_SECTORS,
} from '../../../@core/common/apiRoutes';

import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  deleteJob,
  getJobId,
  publishJob,
} from '../../../services/IndustryManagement/JobService';
import {
  isResponseSuccess,
  getIntlDateFromString,
} from '../../../@core/utilities/helpers';
import IconJobSector from '../../../@core/icons/IconJobSector';
import {useRouter} from 'next/router';
import {
  LINK_JOB_CREATE_OR_UPDATE,
  LINK_JOB_DETAILS_VIEW,
} from '../../../@core/common/appLinks';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import {FiUser} from 'react-icons/fi';
import {Link} from '../../../@core/elements/common';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {JobLevel} from './jobPost/enums/JobPostEnums';
import {useFetchPublicSkills} from '../../../services/learnerManagement/hooks';
import {
  IGridColDef,
  ISelectFilterItem,
} from '../../../shared/Interface/common.interface';
import {getBrowserCookie} from '../../../@core/libs/cookieInstance';
import {COOKIE_KEY_APP_CURRENT_LANG} from '../../../shared/constants/AppConst';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import DataTable from '../../../@core/components/DataTable';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {Typography} from '@mui/material';
//import {useFetchJobSectors} from '../../../services/organaizationManagement/hooks';

const JobListPage = () => {
  const {messages, locale, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const router = useRouter();
  const language = getBrowserCookie(COOKIE_KEY_APP_CURRENT_LANG) || 'bn';
  const {job: jobPermission} =
    useContext<PermissionContextPropsType>(PermissionContext);
  //const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);

  //const [jobSectorFilters] = useState({});
  //const {data: jobSectors}: any = useFetchJobSectors(jobSectorFilters);

  const [skillFilters] = useState<any>({});
  const {data: skills} = useFetchPublicSkills(skillFilters);
  const [skillFilterItems, setSkillFilterItems] = useState<
    Array<ISelectFilterItem>
  >([]);
  /*  const [jobSectorFilterItems, setJobSectorFilterItems] = useState<
    Array<ISelectFilterItem>
  >([]);*/

  useEffect(() => {
    if (skills) {
      setSkillFilterItems(
        skills.map((skill: any) => {
          if (language === 'bn') {
            return {
              id: skill?.id,
              title: skill?.title,
            };
          } else {
            return {
              id: skill?.id,
              title: skill?.title_en,
            };
          }
        }),
      );
    }
  }, [skills]);

  /*useEffect(() => {
    if (jobSectors) {
      setJobSectorFilterItems(
        jobSectors.map((jobSector: any) => {
          if (language === 'bn') {
            return {
              id: jobSector?.id,
              title: jobSector?.title,
            };
          } else {
            return {
              id: jobSector?.id,
              title: jobSector?.title_en,
            };
          }
        }),
      );
    }
  }, [jobSectors]);*/

  const courseLevelFilterItems = [
    {id: JobLevel.ENTRY, title: messages['label.job_level_entry'] as string},
    {id: JobLevel.MID, title: messages['label.job_level_mid'] as string},
    {id: JobLevel.TOP, title: messages['label.job_level_top'] as string},
  ];

  const openJobCreateView = useCallback(() => {
    (async () => {
      try {
        const response = await getJobId();

        if (response && response?.data) {
          openJobAddUpdateView(response.data);
        } else {
          errorStack('Failed to get job id');
        }
      } catch (error: any) {
        errorStack('Failed to get job id');
      }
    })();
  }, []);

  const openJobAddUpdateView = useCallback((jobId: string) => {
    router
      .push({
        pathname: LINK_JOB_CREATE_OR_UPDATE + 'step1',
        query: {jobId: jobId},
      })
      .then(() => {});
  }, []);

  const openJobDetailsView = useCallback((jobId: string) => {
    router
      .push({
        pathname: LINK_JOB_DETAILS_VIEW + jobId,
      })
      .then(() => {});
  }, []);

  const deleteJobItem = async (jobId: string) => {
    let response = await deleteJob(jobId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='common.jobs' />}}
        />,
      );
      refreshDataTable();
    }
  };

  const publishAction = async (jobId: string) => {
    try {
      const data: any = {status: 1};
      let response = await publishJob(jobId, data);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_publish_successfully'
            values={{subject: <IntlMessages id='common.job' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const archiveAction = async (jobId: string) => {
    const data: any = {status: 2};
    let response = await publishJob(jobId, data);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_archive_successfully'
          values={{subject: <IntlMessages id='common.job' />}}
        />,
      );
      refreshDataTable();
    }
  };

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((prevToggle: any) => !prevToggle);
  }, [isToggleTable]);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['job_posting.job_title'] as string,
        field: 'job_title',
        filterable: true,
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['job_posting.job_title_en'] as string,
        field: 'job_title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['job_sectors.label'] as string,
        field: 'job_sector_id',
        width: 250,
        hideable: true,
        filterable: true,
        hide: false,
        filterKey: 'job_sector_ids',
        filter: {
          apiPath: API_PUBLIC_JOB_SECTORS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: true,
        },
        renderCell: (props: any) => {
          let data = props.row;
          return locale == LocaleLanguage.BN ? (
            <Typography>{data.job_sector_title}</Typography>
          ) : (
            <Typography>{data.job_sector_title_en} </Typography>
          );
        },
      },
      {
        headerName: messages['occupations.label'] as string,
        field: 'occupation_title',
        width: 250,
        sortable: true,
        filterable: true,
        filterKey: 'occupation_ids',
        filter: {
          apiPath: API_PUBLIC_OCCUPATIONS,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: true,
        },
      },

      /*{
        Header: messages['job_sectors.label'],
        accessor: 'job_sector_ids',
        selectFilterItems: jobSectorFilterItems,
        Cell: (props: any) => {
          const data = props?.row?.original;
          return <>{data?.job_sector_id}</>;
        },
      },*/

      /*{
        Header: messages['label.job_sector'],
        //filter: 'selectFilter',
        accessor: 'job_sector_id',
        /!*selectFilterItems: jobSectors,
        Cell: (props: any) => {
          let data = props.row;
          if (data?.job_sector_id) {
            return <>{data?.job_sector_id}</>;
          }
        },*!/
      },*/

      {
        headerName: messages['label.job_level'] as string,
        field: 'job_level',
        width: 250,
        filterable: true,
        sortable: true,
        filter: {
          options: courseLevelFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;

          return (
            <>
              {data?.additional_job_information?.job_levels
                ?.map((job_level: any) =>
                  job_level?.job_level_id == JobLevel.ENTRY
                    ? messages['label.job_level_entry']
                    : job_level.job_level_id == JobLevel.MID
                    ? messages['label.job_level_mid']
                    : messages['label.job_level_top'],
                )
                .join(',')}
            </>
          );
        },
      },
      {
        headerName: messages['skill.label'] as string,
        field: 'skill_ids',
        hide: true,
        filterable: true,
        sortable: true,
        width: 250,
        filter: {
          options: skillFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: true,
        },
        renderCell: (props: any) => {
          const data = props?.row;
          return data?.candidate_requirement?.skills?.map((skill: any) => (
            <>{skill?.title_en + `, `}</>
          ));
        },
      },
      {
        headerName: messages['common.publication_deadline'] as string,
        field: 'application_deadline',
        width: 250,
        sortable: true,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data.application_deadline ? (
                <Typography>
                  {getIntlDateFromString(
                    formatDate,
                    data.application_deadline,
                    'short',
                  )}
                </Typography>
              ) : (
                <></>
              )}
            </>
          );
        },
      },
      {
        headerName: messages['common.publish_at'] as string,
        field: 'published_at',
        width: 250,
        sortable: true,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data.published_at ? (
                <Typography>
                  {getIntlDateFromString(
                    formatDate,
                    data.published_at,
                    'short',
                  )}
                </Typography>
              ) : (
                <></>
              )}
            </>
          );
        },
      },
      {
        headerName: messages['common.archive'] as string,
        field: 'archived_at',
        width: 250,
        sortable: true,
        filterable: true,
        dateRangeFilter: true,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <>
              {data?.archived_at ? (
                <Typography>
                  {getIntlDateFromString(formatDate, data.archived_at, 'short')}
                </Typography>
              ) : (
                <></>
              )}
            </>
          );
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'actions',
        renderCell: (props: any) => {
          let data = props.row;
          let today = new Date().toISOString().slice(0, 10);

          return (
            <DatatableButtonGroup>
              {jobPermission.canRead && (
                <ReadButton
                  onClick={() => {
                    openJobDetailsView(data.job_id);
                  }}
                />
              )}
              {jobPermission.canUpdate && (
                <EditButton
                  onClick={() => {
                    openJobAddUpdateView(data.job_id);
                  }}
                />
              )}
              {jobPermission.canDelete &&
                (!data?.published_at || data?.archived_at) && (
                  <ConfirmationButton
                    buttonType={'delete'}
                    confirmAction={() => deleteJobItem(data.job_id)}
                  />
                )}

              {jobPermission.canUpdate &&
                !data?.published_at &&
                data?.application_deadline >= today && (
                  <ConfirmationButton
                    buttonType={'publish'}
                    confirmAction={() => publishAction(data.job_id)}
                  />
                )}
              {jobPermission.canUpdate &&
              data?.published_at &&
              !data?.archived_at ? (
                <ConfirmationButton
                  buttonType={'publish'}
                  confirmAction={() => archiveAction(data.job_id)}
                  dialogTitle={messages['common.archive_item'] as string}
                  labelMessageKey={'common.archive'}
                />
              ) : (
                <></>
              )}
              {jobPermission.canRead && (
                <Link href={`jobs/candidates/${data?.job_id}`}>
                  <CommonButton
                    btnText='common.candidates'
                    startIcon={<FiUser style={{marginLeft: '5px'}} />}
                    variant={'text'}
                  />
                </Link>
              )}
            </DatatableButtonGroup>
          );
        },
        width: 550,
        sortable: false,
      },
    ],
    [
      messages,
      locale,
      courseLevelFilterItems,
      skillFilterItems,
      //jobSectorFilterItems,
    ],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_JOBS,
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconJobSector /> <IntlMessages id='job_lists.label' />
          </>
        }
        extra={[
          jobPermission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openJobCreateView()}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['job_lists.label'],
                  }}
                />
              }
            />
          ) : (
            ''
          ),
        ]}>
        <DataTable
          columns={columns}
          data={data}
          fetchData={onFetchData}
          loading={loading}
          showColumnToolbar={true}
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
        />
      </PageContentBlock>
    </>
  );
};

export default JobListPage;
