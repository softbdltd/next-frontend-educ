import asyncComponent from '../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../@core/core/PageMeta';
import DashboardPage from '../../../../@core/layouts/hoc/DashboardPage';
import React from 'react';
import {useIntl} from 'react-intl';

const SkillsDevelopmentTrainingActivitiesIncomeExpenditureInformationPage =
  asyncComponent(
    () =>
      import(
        '../../../../modules/dashboard/trainingCenterReports/IncomeExpenditureReportPage'
      ),
  );
export default DashboardPage(() => {
  const {messages} = useIntl();
  return (
    <>
      <PageMeta
        title={
          messages[
            'skills_development_training_activities_income_expenditure_information.label'
          ]
        }
      />
      <SkillsDevelopmentTrainingActivitiesIncomeExpenditureInformationPage />
    </>
  );
});
