import FrontendCustomModal from '../../../@core/modals/FrontendCustomModal/FrontendCustomModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {ExamTypes} from '../../dashboard/exams/ExamEnums';
import {useIntl} from 'react-intl';
import {Body1} from '../../../@core/elements/common';
import CancelIcon from '@mui/icons-material/Cancel';
import TableSkeleton from '../../../@core/elements/display/skeleton/TableSkeleton/TableSkeleton';
import {Button, Divider, Grid, Table} from '@mui/material';
import React, {Fragment, useState} from 'react';

import {useFetchPublicYouthResult} from '../../../services/instituteManagement/hooks';
import IconList from '../../../@core/icons/IconList';

interface IProps {
  onClose: () => void;
  batchId: any;
  learnerId: any;
  batchTitle: string | null;
}

const ViewResultPopup = ({onClose, batchId, learnerId, batchTitle}: IProps) => {
  const {messages} = useIntl();

  const [resultsParams] = useState<any>({learner_id: learnerId});
  const {data: results, isLoading} = useFetchPublicYouthResult(
    batchId,
    resultsParams,
  );

  const getTypeLabel = (type: any) => {
    switch (Number(type)) {
      case ExamTypes.ONLINE:
        return messages['common.online'];
      case ExamTypes.OFFLINE:
        return messages['common.offline'];
      case ExamTypes.MIXED:
        return messages['common.mixed'];
      case ExamTypes.PRACTICAL:
        return messages['common.practical'];
      case ExamTypes.FIELDWORK:
        return messages['common.field_work'];
      case ExamTypes.PRESENTATION:
        return messages['common.presentation'];
      case ExamTypes.ASSIGNMENT:
        return messages['common.assignment'];
      case ExamTypes.ATTENDANCE:
        return messages['common.attendance'];
      default:
        return '';
    }
  };

  return (
    <FrontendCustomModal
      onClose={onClose}
      open={true}
      title={
        <>
          <IconList />
          <IntlMessages id='education.result' />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      actions={
        <Button
          startIcon={<CancelIcon />}
          variant='outlined'
          onClick={onClose}
          color={'warning'}>
          {'Cancel'}
        </Button>
      }>
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Body1>
            {messages['common.batch_name']}: {batchTitle}
          </Body1>
        </Grid>
        <Grid item xs={12}>
          <Divider
            sx={{marginY: 2, borderBottomWidth: 2, borderColor: '#837c7c'}}
          />
          <Grid container spacing={1}>
            <Grid
              item
              xs={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Body1>{messages['common.exam_type']}</Body1>
            </Grid>

            <Grid
              item
              xs={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Body1>{messages['common.total_marks']}</Body1>
            </Grid>

            <Grid
              item
              xs={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Body1>{messages['common.obtained_mark']}</Body1>
            </Grid>

            <Grid
              item
              xs={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Body1>{messages['common.percentage']}</Body1>
            </Grid>

            <Grid
              item
              xs={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Body1>{messages['common.final_marks']}</Body1>
            </Grid>
          </Grid>
        </Grid>
        {isLoading ? (
          <Grid item xs={12}>
            <Table>
              <TableSkeleton rowSize={5} columnNumbers={4} />
            </Table>
          </Grid>
        ) : (
          <Grid item xs={12}>
            {results &&
              results.result_summaries &&
              results.result_summaries.length > 0 &&
              (results.result_summaries || []).map((result: any) => {
                return (
                  <Fragment key={result.id}>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                        }}>
                        <Body1>{getTypeLabel(result?.exam_type)}</Body1>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Body1>{result?.total_marks}</Body1>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Body1>{result?.obtained_marks}</Body1>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Body1>{result?.percentage}</Body1>
                      </Grid>

                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Body1>{result?.final_marks}</Body1>
                      </Grid>
                    </Grid>
                    <Divider sx={{marginY: 2}} />
                  </Fragment>
                );
              })}
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Body1>
                {messages['common.total_marks']}: {results?.total_marks}
              </Body1>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Body1>
                {messages['education.result']}: {results?.result}
              </Body1>
            </Grid>
          </Grid>
        )}
      </Grid>
    </FrontendCustomModal>
  );
};

export default ViewResultPopup;
