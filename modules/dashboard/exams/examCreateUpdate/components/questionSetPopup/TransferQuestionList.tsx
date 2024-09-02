import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import {Box, Skeleton, Tooltip, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {useFetchExamQuestionsBanks} from '../../../../../../services/instituteManagement/hooks';
import {intersection, not} from '../../../../../../@core/utilities/helpers';
import {Edit} from '@mui/icons-material';
import QuestionEditPopup from './QuestionEditPopup';
import RowStatus from '../../../../../../@core/utilities/RowStatus';

interface IProps {
  onEditPopupOpenClose: (open: boolean) => void;
  getQuestionSet: any;
  subjectId: any;
  questionType: any;
  eachQuestionMark: number;
  selectedQuestions: any;
  selectionType: any;
}

const TransferQuestionList = ({
  getQuestionSet,
  onEditPopupOpenClose,
  subjectId,
  questionType,
  eachQuestionMark,
  selectedQuestions,
  selectionType,
}: IProps) => {
  const [checked, setChecked] = React.useState<any[]>([]);
  const [leftQuestionList, setLeftQuestionList] = React.useState<any[]>([]);
  const [rightQuestionList, setRightQuestionList] = React.useState<any[]>([]);

  const [questionBankFilters] = useState({
    subject_id: subjectId,
    question_type: questionType,
    row_status: RowStatus.ACTIVE,
  });

  const {data: questionBank, isLoading: isLoadingQuestions} =
    useFetchExamQuestionsBanks(questionBankFilters);

  useEffect(() => {
    if (selectedQuestions && selectedQuestions.length > 0) {
      setRightQuestionList(selectedQuestions);
    }
  }, [selectedQuestions]);

  useEffect(() => {
    if (questionBank && questionBank?.length > 0) {
      if (rightQuestionList?.length > 0) {
        const filteredQuestions = questionBank?.filter((ques: any) =>
          rightQuestionList?.every(
            (rightSideQuestion: any) => rightSideQuestion?.id !== ques?.id,
          ),
        );

        setLeftQuestionList(filteredQuestions);
      } else {
        setLeftQuestionList(questionBank);
      }
    }
  }, [questionBank, rightQuestionList]);

  useEffect(() => {
    getQuestionSet(rightQuestionList);
  }, [rightQuestionList]);

  const leftChecked = intersection(checked, leftQuestionList);
  const rightChecked = intersection(checked, rightQuestionList);

  const handleToggle = (value: any) => () => {
    const found = checked?.some((item) => item?.id === value?.id);
    const newChecked = [...checked];

    if (!found) {
      newChecked.push(value);
    } else {
      const index = newChecked?.findIndex((item) => item?.id === value?.id);
      newChecked.splice(index, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRight = () => {
    const leftQ = [...leftQuestionList];
    leftQ.map((question: any) => {
      question.individual_marks = eachQuestionMark;
    });

    setRightQuestionList(rightQuestionList.concat(leftQ));
    setLeftQuestionList([]);
  };

  const moveCheckedToRight = () => {
    const leftQ = [...leftChecked];
    leftQ.map((question: any) => {
      question.individual_marks = eachQuestionMark;
    });

    setRightQuestionList(rightQuestionList.concat(leftQ));
    setLeftQuestionList(not(leftQuestionList, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const moveCheckedToLeft = () => {
    setLeftQuestionList(leftQuestionList.concat(rightChecked));
    setRightQuestionList(not(rightQuestionList, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeftQuestionList(leftQuestionList.concat(rightQuestionList));
    setRightQuestionList([]);
  };

  /** question edit section */

  const [isOpenEditForm, setIsOpenEditForm] = React.useState<boolean>(false);
  const [editableQuestion, setEditableQuestion] = React.useState<object>({});

  const handleEditQuestion = (questionId: any) => {
    const question = rightQuestionList.find(
      (question: any) => question?.id === questionId,
    );
    setEditableQuestion(question);
    setIsOpenEditForm(true);
    onEditPopupOpenClose(true);
  };

  const handleCloseQuestionEdit = () => {
    setIsOpenEditForm(false);
    onEditPopupOpenClose(false);
  };

  const getEditedQuestion = useCallback(
    (updatedQuestion: any) => {
      let questionList = [...rightQuestionList];

      let foundIndex = questionList.findIndex(
        (question: any) => question.id == updatedQuestion.id,
      );
      questionList[foundIndex] = updatedQuestion;

      setRightQuestionList(questionList);
    },
    [rightQuestionList],
  );

  const customList = (questions: any[], isRightQuestions = false) => (
    <Paper sx={{width: '100%', overflow: 'auto', height: '100%'}}>
      <List dense component='div' role='list'>
        {questions?.map((question: any, index) => {
          const labelId = `transfer-list-item-${question?.id}-label`;

          return (
            <ListItem
              key={question?.id}
              role='listitem'
              sx={index != 0 ? {borderTop: '1px solid #bdb7b7'} : {}}>
              <ListItemIcon>
                <Checkbox
                  checked={checked?.some((item) => item?.id === question?.id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                  onClick={handleToggle(question)}
                />
              </ListItemIcon>
              <Box display={'flex'} alignItems={'center'}>
                <Typography sx={{width: '90%'}}>{question?.title}</Typography>
                {isRightQuestions && (
                  <>
                    {question?.individual_marks && (
                      <Tooltip title={'Individual Mark'} arrow>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color: 'green',
                            marginLeft: '15px',
                          }}>
                          {question?.individual_marks}
                        </Typography>
                      </Tooltip>
                    )}
                    <Edit
                      sx={{
                        marginLeft: '6px',
                        marginBottom: '5px',
                        fontSize: '1.3rem',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleEditQuestion(question?.id)}
                    />
                  </>
                )}
              </Box>
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  return (
    <React.Fragment>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={5}>
          {isLoadingQuestions ? (
            <Skeleton
              variant='rectangular'
              width={'100%'}
              height={300}
              sx={{margin: 'auto', marginTop: 5}}
            />
          ) : (
            customList(leftQuestionList)
          )}
        </Grid>
        <Grid item xs={2}>
          <Grid container direction='column' alignItems='center'>
            <Button
              sx={{my: 0.5}}
              variant='outlined'
              size='small'
              onClick={handleAllRight}
              disabled={leftQuestionList?.length === 0}
              aria-label='move all right'>
              ≫
            </Button>
            <Button
              sx={{my: 0.5}}
              variant='outlined'
              size='small'
              onClick={moveCheckedToRight}
              disabled={leftChecked?.length === 0}
              aria-label='move selected right'>
              &gt;
            </Button>
            <Button
              sx={{my: 0.5}}
              variant='outlined'
              size='small'
              onClick={moveCheckedToLeft}
              disabled={rightChecked?.length === 0}
              aria-label='move selected left'>
              &lt;
            </Button>
            <Button
              sx={{my: 0.5}}
              variant='outlined'
              size='small'
              onClick={handleAllLeft}
              disabled={rightQuestionList?.length === 0}
              aria-label='move all left'>
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          {isLoadingQuestions ? (
            <Skeleton
              variant='rectangular'
              width={'100%'}
              height={300}
              sx={{margin: 'auto', marginTop: 5}}
            />
          ) : (
            customList(rightQuestionList, true)
          )}
        </Grid>
      </Grid>
      {isOpenEditForm && (
        <QuestionEditPopup
          itemData={editableQuestion}
          onClose={handleCloseQuestionEdit}
          getEditedQuestion={getEditedQuestion}
          selectionType={selectionType}
        />
      )}
    </React.Fragment>
  );
};

export default TransferQuestionList;
