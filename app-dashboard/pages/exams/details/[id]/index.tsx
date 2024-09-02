import asyncComponent from '../../../../../@core/utility/asyncComponent';
import PageMeta from '../../../../../@core/core/PageMeta';
import DashboardPage from '../../../../../@core/layouts/hoc/DashboardPage';
import {useIntl} from 'react-intl';

const ExamDetails = asyncComponent(
  () =>
    import(
      '../../../../../modules/dashboard/exams/examDetails/ExamDetailsPage'
    ),
);
export default DashboardPage(() => {
  const {messages} = useIntl();

  return (
    <>
      <PageMeta title={messages['exam.label'] as string} />
      <ExamDetails />
    </>
  );
});
