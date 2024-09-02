import React from 'react';
import {DefaultFonts} from '../../constants';
import {ShapeType, TextConfig} from '../../interfaces/Shape';
import useElementsDispatcher from '../../state/dispatchers/elements';
import Button from '../ui/Button';
import SideMenuPanel from '../ui/SideMenuPanel';

const DEFAULT_PROPERTIES = {
  fontSize: 24,
  fontFamily: DefaultFonts.Regular,
  align: 'center',
  fillEnabled: true,
  fill: 'rgba(0, 0, 0, 1)',
  lineHeight: 1,
  shadowEnabled: false,
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowBlur: 5,
  strokeEnabled: false,
  stroke: 'rgba(0, 0, 0, 1)',
  strokeWidth: 1,
};

const INPUT_PROPERTY = {
  candidateName: {
    text: 'Candidate Name',
    class: 'candidate-name',
  },
  fatherName: {
    text: 'Father Name',
    class: 'father-name',
  },
  motherName: {
    text: 'Mother Name',
    class: 'mother-name',
  },
  candidateNid: {
    text: 'Candidate Nid',
    class: 'candidate-nid',
  },
  candidateBcid: {
    text: 'Candidate Birth ID',
    class: 'candidate-birth-cid',
  },
  batchName: {
    text: 'Batch Name',
    class: 'batch-name',
  },
  courseName: {
    text: 'Course Name',
    class: 'course-name',
  },
  trainingName: {
    text: 'Training Center',
    class: 'training-center',
  },
  batchStartDate: {
    text: 'Batch Start Date',
    class: 'batch-start-date',
  },
  batchEndDate: {
    text: 'Batch End Date',
    class: 'batch-end-date',
  },
  grade: {
    text: 'Grade',
    class: 'grade',
  },
  marks: {
    text: 'Marks',
    class: 'marks',
  },
  membership_id_number: {
    text: 'Member Ship Number',
    class: 'membership_id_number',
  },
  title: {
    text: 'Institute Name',
    class: 'title',
  },
  address: {
    text: 'Address (EN)',
    class: 'address',
  },
  contact_person_name: {
    text: 'Name (English)',
    class: 'contact_person_name',
  },
  tin_no: {
    text: 'TIN No',
    class: 'tin_no',
  },
  previous_membership_no: {
    text: 'Previous Membership no',
    class: 'previous_membership_no',
  },
  first_issue_date: {
    text: 'First Issue Date',
    class: 'first_issue_date',
  },
  expire_date: {
    text: 'Expire date',
    class: 'expire_date',
  },
  last_update_date: {
    text: 'Last Update date',
    class: 'last_update_date',
  },
};
type INPUT = keyof typeof INPUT_PROPERTY;

function InputToolPanel() {
  const {createElement} = useElementsDispatcher();

  const handleClickAddText = (input: INPUT) => () => {
    const data = {
      ...INPUT_PROPERTY[input],
      ...DEFAULT_PROPERTIES,
    };
    createElement<TextConfig>(ShapeType.Input, data);
  };
  return (
    <SideMenuPanel title='Input'>
      <div className='text-picker-button-container'>
        {(Object.keys(INPUT_PROPERTY) as Array<INPUT>).map(
          (value: INPUT, index) => {
            return (
              <Button
                key={index}
                type='gray'
                className='text-picker-button'
                style={{fontFamily: DefaultFonts.Regular, fontWeight: 'normal'}}
                onClick={handleClickAddText(value)}>
                {INPUT_PROPERTY[value].text}
              </Button>
            );
          },
        )}
      </div>
    </SideMenuPanel>
  );
}

export default InputToolPanel;
