import {useRouter} from 'next/router';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AdditionalSelectFilterField from '../../../@core/components/DataTable/AdditionalSelectFilterField';
import AddButton from '../../../@core/elements/button/AddButton/AddButton';
import {useIntl} from 'react-intl';
import ReadButton from '../../../@core/elements/button/ReadButton/ReadButton';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import DatatableButtonGroup from '../../../@core/elements/button/DatatableButtonGroup/DatatableButtonGroup';
import {API_COURSES, API_INSTITUTES} from '../../../@core/common/apiRoutes';
import CourseAddEditPopup from './CourseAddEditPopup';
import CourseDetailsPopup from './CourseDetailsPopup';
import CustomChipRowStatus from '../../../@core/elements/display/CustomChipRowStatus/CustomChipRowStatus';

import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {deleteCourse} from '../../../services/instituteManagement/CourseService';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IconCourse from '../../../@core/icons/IconCourse';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {LEVEL} from './CourseEnums';
import {useFetchPublicSkills} from '../../../services/learnerManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import {IGridColDef} from '../../../shared/Interface/common.interface';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import DataTable from '../../../@core/components/DataTable';
import useFetchTableData from '../../../@core/hooks/useFetchTableData';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import EditIcon from '@mui/icons-material/Edit';
import CommonButton from '../../../@core/elements/button/CommonButton/CommonButton';
import ResultConfigAddEditPopup from './ResultConfigAddEditPopup';
import ConfirmationButton from '../../../@core/elements/button/ConfirmationButton';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import {Tooltip} from '@mui/material';
import localeLanguage from '../../../@core/utilities/LocaleLanguage';
import TextFilterField from '../../../@core/components/DataTable/TextFilterField';

const CoursePage = () => {
  const {messages, locale} = useIntl();
  const router = useRouter();
  const {successStack, errorStack} = useNotiStack();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isOpenAddEditModal, setIsOpenAddEditModal] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [isOpenResultConfigModal, setIsOpenResultConfigModal] = useState(false);
  const [additionalFilters, setAdditionalFilters] = useState<any>({});
  const [isToggleTable, setIsToggleTable] = useState<boolean>(false);
  const authUser = useAuthUser<CommonAuthUser>();
  const {course: course_permission, other_permissions} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const [learnerSkillsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: skills} = useFetchPublicSkills(learnerSkillsFilter);

  const [skillFilterItems, setSkillFilterItems] = useState([]);

  useEffect(() => {
    if (skills) {
      setSkillFilterItems(
        skills.map((skill: any) => {
          if (locale === localeLanguage.BN) {
            return {
              id: skill?.id,
              title: `${skill?.title} (${skill?.title_en})`,
            };
          } else {
            return {
              id: skill?.id,
              title: `${skill?.title} (${skill?.title_en})`,
            };
          }
        }),
      );
    }
  }, [skills, locale]);

  const closeAddEditModal = useCallback(() => {
    setIsOpenAddEditModal(false);
    setSelectedItemId(null);
  }, []);

  const openAddEditModal = useCallback((itemId: number | null = null) => {
    setIsOpenDetailsModal(false);
    setIsOpenAddEditModal(true);
    setSelectedItemId(itemId);
  }, []);

  const openDetailsModal = useCallback(
    (itemId: number) => {
      setIsOpenDetailsModal(true);
      setSelectedItemId(itemId);
    },
    [selectedItemId],
  );

  const openResultConfigModal = useCallback(
    (itemId: number) => {
      setIsOpenResultConfigModal(true);
      setSelectedItemId(itemId);
    },
    [selectedItemId],
  );

  const closeDetailsModal = useCallback(() => {
    setIsOpenDetailsModal(false);
  }, []);

  const closeResultConfigModal = useCallback(() => {
    setIsOpenResultConfigModal(false);
  }, []);

  const deleteCourseItem = async (courseId: number) => {
    try {
      let response = await deleteCourse(courseId);
      if (isResponseSuccess(response)) {
        successStack(
          <IntlMessages
            id='common.subject_deleted_successfully'
            values={{subject: <IntlMessages id='course.label' />}}
          />,
        );
        refreshDataTable();
      }
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  const courseLevelFilterItems = useMemo(() => {
    return [
      {id: LEVEL.BEGINNER, title: messages['level.beginner'] as string},
      {id: LEVEL.INTERMEDIATE, title: messages['level.intermediate'] as string},
      {id: LEVEL.EXPERT, title: messages['level.expert'] as string},
    ];
  }, [messages]);

  const courseAvailability = useMemo(() => {
    return [
      {id: 1, title: messages['common.running'] as string},
      // {id: 2, title: messages['common.upcoming'] as string},
      // {id: 3, title: messages['common.completed'] as string},
    ];
  }, [messages]);

  const refreshDataTable = useCallback(() => {
    setIsToggleTable((prevToggle: any) => !prevToggle);
  }, [isToggleTable]);

  const columns = useMemo(
    (): IGridColDef[] => [
      {
        headerName: messages['common.title'] as string,
        field: 'title',
        width: 250,
        filterable: true,
        sortable: true,
        hide: locale == LocaleLanguage.EN,
      },
      {
        headerName: messages['common.title_en'] as string,
        field: 'title_en',
        width: 250,
        sortable: true,
        hide: locale == LocaleLanguage.BN,
      },
      {
        headerName: messages['institute.label'] as string,
        field: 'institute_title',
        width: 350,
        hide: true,
        filterable: Boolean(authUser && authUser?.isSystemUser),
        filter: {
          apiPath: API_INSTITUTES,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        filterKey: 'institute_id',
      },
      {
        headerName: messages['institute.label_en'] as string,
        field: 'institute_title_en',
        width: 350,
        hide: true,
      },

      {
        headerName: messages['common.course_fee'] as string,
        field: 'course_fee',
        // filterable: true,
      },
      {
        headerName: messages['course.admission_fee'] as string,
        field: 'admission_fee',
      },

      {
        headerName: messages['course.duration'] as string,
        field: 'duration',
        width: 100,
        filterable: true,
      },
      {
        headerName: messages['skill.label'] as string,
        field: 'skill',
        width: 500,
        sortable: false,
        filterable: true,
        filterKey: 'skill_ids',
        filter: {
          options: skillFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title', 'title_en'],
          multiSelect: true,
        },
        renderCell: (props: any) => {
          let data = props.row;

          const skills = data.skills.map((skill: any) => skill.title);
          const tooltipText = skills.join(', ');

          return (
            <Tooltip title={tooltipText} placement={'top'}>
              <p
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '480px',
                }}>
                {tooltipText}
              </p>
            </Tooltip>
          );
        },
      },
      {
        headerName: messages['course.course_level'] as string,
        field: 'level',
        filterable: true,
        width: 120,
        filter: {
          options: courseLevelFilterItems,
          valueFieldName: 'id',
          labelFieldNames: ['title'],
          multiSelect: false,
        },
        renderCell: (props: any) => {
          let data = props.row;
          if (data?.level == LEVEL.BEGINNER) {
            return <>{messages['level.beginner']}</>;
          } else if (data?.level == LEVEL.INTERMEDIATE) {
            return <>{messages['level.intermediate']}</>;
          } else {
            return <>{messages['level.expert']}</>;
          }
        },
      },
      {
        headerName: messages['common.status'] as string,
        field: 'row_status',
        width: 150,
        hide: true,
        renderCell: (props: any) => {
          let data = props.row;
          return <CustomChipRowStatus value={data?.row_status} />;
        },
      },
      {
        headerName: messages['common.actions'] as string,
        field: 'action',
        width: 500,
        renderCell: (props: any) => {
          let data = props.row;
          return (
            <DatatableButtonGroup>
              {course_permission.canRead && (
                <ReadButton onClick={() => openDetailsModal(data.id)} />
              )}
              {course_permission.canUpdate && (
                <EditButton onClick={() => openAddEditModal(data.id)} />
              )}
              {course_permission.canDelete && (
                <ConfirmationButton
                  buttonType={'delete'}
                  confirmAction={() => deleteCourseItem(data.id)}
                />
              )}
              {other_permissions.create_exam_result_config && (
                <CommonButton
                  onClick={() => {
                    openResultConfigModal(data.id);
                  }}
                  btnText='common.result_config'
                  startIcon={<EditIcon />}
                  color='primary'
                />
              )}
            </DatatableButtonGroup>
          );
        },
        sortable: false,
      },
    ],
    [messages, locale, skillFilterItems, courseLevelFilterItems],
  );

  const {onFetchData, data, loading, totalCount} = useFetchTableData({
    urlPath: API_COURSES,
    paramsValueModifier: (params: any) => {
      if (router.query.availability)
        params['availability'] = router.query.availability;

      return params;
    },
  });

  return (
    <>
      <PageContentBlock
        title={
          <>
            <IconCourse /> <IntlMessages id='course.label' />
          </>
        }
        extra={[
          course_permission.canCreate ? (
            <AddButton
              key={1}
              onClick={() => openAddEditModal(null)}
              isLoading={loading}
              tooltip={
                <IntlMessages
                  id={'common.add_new'}
                  values={{
                    subject: messages['course.label'],
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
          totalCount={totalCount}
          toggleResetTable={isToggleTable}
          filterExpanded={false}
          additionalFilterFields={(routeValue, onChange) => {
            return (
              <>
                <TextFilterField
                  id={'course_fee_min'}
                  label={messages['course.course_fee_min'] as string}
                  value={routeValue['course_fee_min'] ?? ''}
                  onChange={(key: string, value: string) => {
                    let filters = {
                      ...additionalFilters,
                      [key]: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
                <TextFilterField
                  id={'course_fee_max'}
                  label={messages['course.course_fee_max'] as string}
                  value={routeValue['course_fee_max'] ?? ''}
                  onChange={(key: string, value: string) => {
                    let filters = {
                      ...additionalFilters,
                      [key]: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
                <AdditionalSelectFilterField
                  id='availability'
                  label={messages['course.availability']}
                  isLoading={false}
                  options={courseAvailability}
                  valueFieldName={'id'}
                  labelFieldNames={['title']}
                  value={routeValue['availability'] ?? ''}
                  onChange={(value: any) => {
                    let filters = {
                      ...additionalFilters,
                      ['availability']: value,
                    };
                    onChange(filters);
                    setAdditionalFilters(filters);
                  }}
                />
              </>
            );
          }}
        />
        {isOpenAddEditModal && (
          <CourseAddEditPopup
            key={1}
            onClose={closeAddEditModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}

        {isOpenDetailsModal && selectedItemId && (
          <CourseDetailsPopup
            key={2}
            itemId={selectedItemId}
            onClose={closeDetailsModal}
            openEditModal={openAddEditModal}
          />
        )}

        {isOpenResultConfigModal && selectedItemId && (
          <ResultConfigAddEditPopup
            key={3}
            onClose={closeResultConfigModal}
            itemId={selectedItemId}
            refreshDataTable={refreshDataTable}
          />
        )}
      </PageContentBlock>
    </>
  );
};

export default CoursePage;
