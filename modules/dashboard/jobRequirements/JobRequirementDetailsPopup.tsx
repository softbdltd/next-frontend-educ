import {useIntl} from 'react-intl';
import {useFetchHrDemandDetails} from '../../../services/IndustryManagement/hooks';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IconList from '../../../@core/icons/IconList';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {Grid} from '@mui/material';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import React, {useEffect, useState} from 'react';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {isBreakPointUp} from '../../../@core/utility/Utils';

type Props = {
  itemId: number;
  onClose: () => void;
};

const JobRequirementDetailsPopup = ({itemId, ...props}: Props) => {
  const {messages} = useIntl();
  const [instituteTitles, setInstituteTitles] = useState<Array<string>>([]);
  const [mandatorySkills, setMandatorySkills] = useState<Array<string>>([]);
  const [optionalSkills, setOptionalSkills] = useState<Array<string>>([]);

  const {data: itemData, isLoading} = useFetchHrDemandDetails(itemId);

  useEffect(() => {
    let institutes: Array<any> = [];
    itemData?.hr_demand_institutes.forEach((institute: any) => {
      institutes.push(
        <div
          dangerouslySetInnerHTML={{
            __html: `<Chip>${institute.institute_title}</Chip>`,
          }}
        />,
      );
      institutes.push(' ');
    });
    setInstituteTitles(institutes);

    let mandatorySkills: Array<any> = [];
    if (itemData && itemData?.mandatory_skills.length > 0) {
      itemData.mandatory_skills.forEach((skill: any) => {
        mandatorySkills.push(
          <div
            dangerouslySetInnerHTML={{
              __html: `<Chip>${skill.title}</Chip>`,
            }}
          />,
        );
      });
    }

    setMandatorySkills(mandatorySkills);

    let optionalSkills: Array<any> = [];
    if (itemData && itemData?.optional_skills.length > 0) {
      itemData.optional_skills.forEach((skill: any) => {
        optionalSkills.push(
          <div
            dangerouslySetInnerHTML={{
              __html: `<Chip>${skill.title}</Chip>`,
            }}
          />,
        );
      });
    }

    setOptionalSkills(optionalSkills);
  }, [itemData]);

  return (
    <>
      <CustomDetailsViewMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconList />
            <IntlMessages id='common.human_resource' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
        }>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.industry_name']}
              value={itemData?.organization_title}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.institute_name']}
              value={instituteTitles}
              isLoading={isLoading}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.mandatory_skills']}
              value={mandatorySkills}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.optional_skills']}
              value={optionalSkills}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.no_of_vacancy']}
              value={itemData?.vacancy}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.requirements']}
              value={itemData?.requirement}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.requirements_en']}
              value={itemData?.requirement_en}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.designation']}
              value={itemData?.designation}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DetailsInputView
              label={messages['common.designation_en']}
              value={itemData?.designation_en}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default JobRequirementDetailsPopup;
