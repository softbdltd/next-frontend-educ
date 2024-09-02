import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {Divider, Grid} from '@mui/material';
import React, {Fragment} from 'react';
import {useFetchYouthResult} from '../../../services/instituteManagement/hooks';
import {Body1} from '../../../@core/elements/common';
import {useIntl} from 'react-intl';
import TableSkeleton from '../../../@core/elements/display/skeleton/TableSkeleton/TableSkeleton';
import {ExamTypes} from '../exams/ExamEnums';

interface IProps {
  itemId: number | null;
  onClose: () => void;
  batchTitle: string;
  YouthTitle: string | null;
}

const YouthSingleExamDetailsPopup = ({
  itemId,
  batchTitle,
  YouthTitle,
  ...props
}: IProps) => {
  const {messages} = useIntl();

  const {data: results, isLoading} = useFetchYouthResult(itemId);

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
    <>
      <CustomDetailsViewMuiModal
        {...props}
        open={true}
        title={
          <>
            <IntlMessages id='education.result' />
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
          </>
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
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Body1>
              {messages['common.name_bn']}: {YouthTitle}
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
              <TableSkeleton rowSize={5} columnNumbers={4} />
            </Grid>
          ) : (
            <Grid item xs={12}>
              {results &&
                (results || []).map((result: any) => (
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
                ))}
            </Grid>
          )}
        </Grid>
      </CustomDetailsViewMuiModal>
    </>
  );
};

export default YouthSingleExamDetailsPopup;
