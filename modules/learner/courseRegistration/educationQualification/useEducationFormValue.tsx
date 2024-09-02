import {cloneDeep} from 'lodash';
import {useState, useEffect, useCallback} from 'react';
interface IResult {
  id: string;
  code: string;
  title: string;
  title_en: string;
}

interface IDegree {
  id: string;
  code: string;
  title: string;
  title_en: string;

  [key: string]: any;
}
function useEducationFormValue({
  getValues,
  result,
  examDegrees,
  formConfig,
  changeFormConfig,
  edu_level,
  edu_level_config_name,
}: any) {
  const [isForeignInstitute, setIsForeignInstitute] = useState(false);
  const [selectedResult, setSelectedResult] = useState<IResult | null>(null);
  const [checked, setChecked] = useState(false);
  const [defaultCertificateImagePath, setDefaultCertificateImagePath] =
    useState(null);
  const [selectedExamDegree, setSelectedExamDegree] = useState<IDegree | null>(
    null,
  );

  useEffect(() => {
    if (getValues) {
      const honoursInfo = getValues(edu_level);
      const isForeignInstituteValue = honoursInfo?.is_foreign_institute;

      setIsForeignInstitute(isForeignInstituteValue);
      if (honoursInfo.result) {
        onResultChange(honoursInfo.result);
      }

      const certificatePath = getValues(edu_level['certificate_file_path']);
      if (certificatePath) setDefaultCertificateImagePath(certificatePath);
      else setDefaultCertificateImagePath(null);
    }
  }, [getValues, result]);

  const onExamDegreeChange = useCallback(
    (eId) => {
      if (eId) {
        const examLevel = examDegrees.filter((exam: any) => exam.id === eId);
        let eduLevel = Array.isArray(examLevel) ? examLevel[0] : examLevel;
        setSelectedExamDegree(eduLevel);
      } else {
        setSelectedExamDegree(null);
      }
    },
    [examDegrees],
  );

  const onResultChange = useCallback(
    (resultId) => {
      if (resultId && result) {
        const filteredResult = result.filter((res: any) => res.id === resultId);
        setSelectedResult(
          Array.isArray(filteredResult) ? filteredResult[0] : filteredResult,
        );
      } else {
        setSelectedResult(null);
      }
    },
    [result],
  );

  const onCheckboxValueChange = useCallback(
    (evt) => {
      setChecked(evt.target.checked ?? false);
      const clonedData = cloneDeep(formConfig);
      if (evt.target.checked) {
        clonedData[edu_level_config_name].required = true;
      } else {
        clonedData[edu_level_config_name].required = false;
      }
      changeFormConfig(clonedData);
    },
    [formConfig],
  );

  return {
    isForeignInstitute,
    setIsForeignInstitute,
    selectedResult,
    onCheckboxValueChange,
    onResultChange,
    onExamDegreeChange,
    selectedExamDegree,
    checked,
    defaultCertificateImagePath,
  };
}

export default useEducationFormValue;
