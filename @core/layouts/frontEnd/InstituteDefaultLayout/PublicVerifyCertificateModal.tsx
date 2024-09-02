import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Grid, Modal, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import React, {useMemo, useState} from "react";
import {Body1} from "../../../elements/common";
import yup from "../../../libs/yup";
import {useIntl} from "react-intl";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import CustomTextInput from "../../../elements/input/CustomTextInput/CustomTextInput";
import {processServerSideErrors} from "../../../utilities/validationErrorHandler";
import useNotiStack from "../../../hooks/useNotifyStack";
import SubmitButton from "../../../elements/button/SubmitButton/SubmitButton";
import {searchCertificateForVerification} from "../../../../services/learnerManagement/CertificateService";
import {getIntlDateFromString} from "../../../utilities/helpers";
import SearchIcon from '@mui/icons-material/Search';

const PublicVerifyCertificateModal = ({isModalOpen, closeCertificateVerifyModal}: any) => {
  const {messages, formatDate} = useIntl();
  const {errorStack} = useNotiStack();

  const [searchedCertificate, setSearchedCertificate] = useState<any>();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // State to control loading indicator visibility

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      certificate_number: yup
        .string()
        .required()
        .label(messages['common.certificate_number'] as string),
    });
  }, [messages]);

  const {
    handleSubmit,
    setError,
    control,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      if (data) {
        setLoading(true);
        const certificate = await searchCertificateForVerification(data);
        setSearchedCertificate(certificate?.data);
        setFormSubmitted(true);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.log('error-->', error);
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
     {/* <Scrollbar>*/}
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
            outline: 'none',
            width: '750px',
          }}>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    bgcolor: 'white',
                    padding: '12px 16px',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Body1>{messages['menu.certificate_verification']}</Body1>
                  <IconButton
                    aria-label='close'
                    onClick={closeCertificateVerifyModal}>
                    <CloseIcon/>
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}
                      sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Grid item xs={12} md={6} sx={{padding: '0 20px 0 32px !important'}}>
                    <CustomTextInput
                      required
                      id='certificate_number'
                      label={messages['common.certificate_number']}
                      control={control}
                      errorInstance={errors}
                      isLoading={false}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{padding: '16px 20px 10px 32px !important'}}>
                    <SubmitButton isSubmitting={isSubmitting} startIcon={<SearchIcon/>} isLoading={false} label={messages['common.search']}/>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {formSubmitted && !loading && (
                  searchedCertificate ? (
                    <TableContainer>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>{messages['common.name']}</TableCell>
                            <TableCell>{searchedCertificate?.name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>{messages['common.certificate_find_father_name']}</TableCell>
                            <TableCell>{searchedCertificate?.father_name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>{messages['common.certificate_institute_department']}</TableCell>
                            <TableCell>{searchedCertificate?.institute_name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>{messages['common.certificate_training_center']}</TableCell>
                            <TableCell>{searchedCertificate?.training_center_name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>{messages['common.certificate_course_name']}</TableCell>
                            <TableCell>{searchedCertificate?.certification_name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>{messages['common.certificate_grade']}</TableCell>
                            <TableCell>{searchedCertificate?.result}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>{messages['common.certificate_batch_start_date']}</TableCell>
                            <TableCell>{getIntlDateFromString(
                              formatDate,
                              searchedCertificate?.start_date,
                            )}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>{messages['common.certificate_batch_end_date']}</TableCell>
                            <TableCell>{getIntlDateFromString(
                              formatDate,
                              searchedCertificate?.end_date,
                            )}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Body1 sx={{
                        color: 'red',
                        fontWeight: 700,
                        fontSize: '24px'
                      }}>{messages['common.certificate_not_found']}</Body1>
                    </Box>
                  )
                )}
                {/* Display loading indicator */}
                {loading && (
                  <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Body1>Loading...</Body1>
                  </Box>
                )}
              </Grid>
            </Grid>
          </form>
        </Box>
      {/*</Scrollbar>*/}
    </Modal>
  )
}

export default PublicVerifyCertificateModal;
