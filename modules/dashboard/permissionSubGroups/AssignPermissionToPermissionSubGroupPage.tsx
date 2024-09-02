import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {
  groupBy as lodashGroupBy,
  map as lodashMap,
  startCase as lodashStartCase,
  toLower as lodashToLower,
} from 'lodash';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {useIntl} from 'react-intl';
import {isResponseSuccess} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useFetchPermissionSubGroup} from '../../../services/userManagement/hooks';
import {assignPermissions} from '../../../services/userManagement/PermissionSubGroupService';
import {getPermissionGroupWithPermissions} from '../../../services/userManagement/PermissionGroupService';
import PageBlock from '../../../@core/utilities/PageBlock';
import Card from '@mui/material/Card';
import BackButton from '../../../@core/elements/button/BackButton';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {H6} from '../../../@core/elements/common';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {permissionManagementGroups} from '../../../@core/utilities/PermissionsManagementGroupings';
import {getGroupTitleKey} from '../../../@core/utilities/PermissionsGroupTitle';
import PermissionSkeleton from '../../institute/Components/PermissionsSkeleton';
import {Theme} from '@mui/material/styles';

const AssignPermissionToPermissionSubGroupPage = () => {
  const router = useRouter();
  const {messages, locale} = useIntl();
  const {successStack} = useNotiStack();
  const {permissionSubGroupId} = router.query;

  const [permissions, setPermissions] = useState<any>({});
  const [checkedPermissions, setCheckedPermissions] = useState<any>(
    new Set([]),
  );
  const [isLoadingPermissions, setIsLoadingPermissions] =
    useState<boolean>(false);
  const [checkedModules, setCheckedModules] = useState<any>(new Set());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allPermissions, setAllPermissions] = useState<any>(null);
  const [subgroupedPermissions, setSubgroupedPermissions] = useState<any>({});
  const [checkAll, setCheckAll] = useState<boolean>(false);

  const {data: itemData, mutate: mutatePermissionSubGroup} =
    useFetchPermissionSubGroup(Number(permissionSubGroupId));

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (itemData && itemData.permission_group_id) {
        const response = await getPermissionGroupWithPermissions(
          Number(itemData.permission_group_id),
          {permission: 1},
        );
        if (response.data) {
          setAllPermissions(response.data.permissions);
        }
      }
      setIsLoading(false);
    })();
  }, [itemData]);

  useEffect(() => {
    setIsLoadingPermissions(true);
    if (itemData && allPermissions) {
      let selectedPermissions = new Set(
        lodashMap(itemData.permissions || [], 'id'),
      );
      setCheckedPermissions(selectedPermissions);

      let hashPermissions = lodashGroupBy(allPermissions, 'module');
      setPermissions(hashPermissions);

      let groups: any = {};
      Object.keys(hashPermissions).map((module) => {
        if (permissionManagementGroups[module]) {
          if (!groups[permissionManagementGroups[module]]) {
            groups[permissionManagementGroups[module]] = {};
          }
          groups[permissionManagementGroups[module]][module] =
            hashPermissions[module];
        }

        if (
          isAllCheckUnderModule(module, selectedPermissions, hashPermissions)
        ) {
          setCheckedModules((checkedModules: any) =>
            checkedModules.add(module),
          );
        }
      });

      setSubgroupedPermissions(groups);
      setIsLoadingPermissions(false);
    }
  }, [itemData, allPermissions]);

  const handlePermissionCheck = useCallback(
    (permission, module) => {
      const newPermissions = new Set([...checkedPermissions]);
      newPermissions.has(permission)
        ? newPermissions.delete(permission)
        : newPermissions.add(permission);
      setCheckedPermissions(newPermissions);

      if (isAllCheckUnderModule(module, newPermissions, permissions)) {
        setCheckedModules(
          (oldCheckModules: any) => new Set([...oldCheckModules, module]),
        );
      } else {
        uncheckModule(module);
      }
    },
    [permissions, checkedPermissions],
  );

  const handleCheckModuleAllPermissions = useCallback(
    (isChecked: any, module) => {
      const permissionsIds = lodashMap(permissions[module], 'id');
      if (isChecked) {
        setCheckedPermissions(
          new Set([...checkedPermissions, ...permissionsIds]),
        );
        setCheckedModules(new Set([...checkedModules, module]));
      } else {
        let newPermissions = new Set([...checkedPermissions]);
        permissionsIds.forEach((item) => {
          newPermissions.delete(item);
        });
        setCheckedPermissions(newPermissions);
        uncheckModule(module);
      }
    },
    [permissions, checkedPermissions],
  );

  const onCheckAllPermissions = useCallback(
    (e: any) => {
      let checked = e.target.checked;

      const permissionsIds = lodashMap(allPermissions, 'id');
      if (checked) {
        setCheckedPermissions(
          (prev: any) => new Set([...prev, ...permissionsIds]),
        );
        setCheckedModules(
          (prev: any) => new Set([...prev, ...Object.keys(permissions || {})]),
        );
      } else {
        let newPermissions = new Set([]);
        setCheckedPermissions(newPermissions);
        setCheckedModules(new Set([]));
      }

      setCheckAll(checked);
    },
    [allPermissions, permissions],
  );

  const isAllCheckUnderModule = useCallback(
    (module, checkedPermissions, hashPermissions) => {
      const permissionsIds = lodashMap(hashPermissions[module], 'id');
      let allCheckedUnderModule = true;
      for (let i = 0; i < permissionsIds.length; i++) {
        if (!checkedPermissions.has(permissionsIds[i])) {
          allCheckedUnderModule = false;
          break;
        }
      }
      return allCheckedUnderModule;
    },
    [permissions],
  );

  const uncheckModule = useCallback(
    (module) => {
      const modules = new Set([...checkedModules]);
      modules.delete(module);
      setCheckedModules(modules);
    },
    [checkedModules],
  );
  const syncPermissionAction = useCallback(async () => {
    setIsSubmitting(true);
    const response = await assignPermissions(
      Number(permissionSubGroupId),
      Array.from(checkedPermissions),
    );
    mutatePermissionSubGroup();
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_updated_successfully'
          values={{subject: <IntlMessages id='permission.label' />}}
        />,
      );
    }
    setIsSubmitting(false);
  }, [permissionSubGroupId, checkedPermissions]);

  return (
    <PageBlock
      title={
        <IntlMessages
          id='common.assign_permission'
          values={{subject: itemData?.title}}
        />
      }
      extra={[
        <React.Fragment key={1}>
          <BackButton key={1} url={'/permission-sub-groups'} />
          <SubmitButton
            key={2}
            onClick={syncPermissionAction}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            label={messages['permissions.sync_permission'] as string}
          />
        </React.Fragment>,
      ]}>
      {isLoadingPermissions ? (
        <PermissionSkeleton />
      ) : (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <H6>
              <label>
                <Checkbox checked={checkAll} onChange={onCheckAllPermissions} />
                {checkAll
                  ? messages['common.uncheck_all']
                  : messages['common.check_all']}
              </label>
            </H6>
          </Grid>

          {Object.keys(subgroupedPermissions || {}).map((group, index) => {
            const groupPermission = subgroupedPermissions[group];
            return (
              <Grid item xs={12} key={group}>
                <Accordion defaultExpanded={index == 0}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    className={'accordionSummary'}
                    sx={{
                      [`&.accordionSummary.Mui-expanded`]: {
                        borderBottom: '1px solid #cbcbcb',
                      },
                    }}>
                    <Typography>{messages[getGroupTitleKey(group)]}</Typography>
                  </AccordionSummary>
                  <AccordionDetails className={'accordionDetails'}>
                    <Grid
                      container
                      columnSpacing={{xs: 0, md: 1}}
                      rowSpacing={{xs: 3, md: 1}}>
                      {Object.keys(groupPermission).map((module) => {
                        return (
                          <Grid item xs={12} md={4} key={module}>
                            <Card>
                              <CardHeader
                                title={
                                  <label>
                                    <Checkbox
                                      checked={checkedModules.has(module)}
                                      onChange={(e) =>
                                        handleCheckModuleAllPermissions(
                                          e.target.checked,
                                          module,
                                        )
                                      }
                                    />
                                    {lodashStartCase(lodashToLower(module))}
                                  </label>
                                }
                              />
                              <Divider />
                              <CardContent>
                                {groupPermission[module].map(
                                  (permission: any) => {
                                    return (
                                      <label
                                        key={permission.id}
                                        style={{display: 'block'}}>
                                        <Checkbox
                                          value={permission.id}
                                          checked={checkedPermissions.has(
                                            permission.id,
                                          )}
                                          onChange={() =>
                                            handlePermissionCheck(
                                              permission.id,
                                              module,
                                            )
                                          }
                                        />
                                        {lodashStartCase(
                                          locale == LocaleLanguage.BN
                                            ? permission.title
                                            : permission.title_en,
                                        )}
                                      </label>
                                    );
                                  },
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
          <Grid
            item
            xs={12}
            sx={(theme: Theme) => {
              return {
                display: 'flex',
                justifyContent: 'space-between',
                mt: '10px',
                [`${theme.breakpoints.down('sm')}`]: {
                  gap: '10px',
                  flexWrap: 'wrap',
                },
              };
            }}>
            <H6>
              <label>
                <Checkbox checked={checkAll} onChange={onCheckAllPermissions} />
                {checkAll
                  ? messages['common.uncheck_all']
                  : messages['common.check_all']}
              </label>
            </H6>
            <SubmitButton
              onClick={syncPermissionAction}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              label={messages['permissions.sync_permission'] as string}
            />
          </Grid>
        </Grid>
      )}
    </PageBlock>
  );
};

export default AssignPermissionToPermissionSubGroupPage;
