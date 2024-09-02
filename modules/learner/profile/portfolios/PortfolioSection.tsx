import {Box} from '@mui/material';
import {Add} from '@mui/icons-material';
import HorizontalLine from '../component/HorizontalLine';
import CustomCarousel from '../../../../@core/elements/display/CustomCarousel/CustomCarousel';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import CardItemWithButton from '../component/CardItemWithButton';
import PortfolioAddEdit from './PortfolioAddEdit';
import {useFetchPortfolios} from '../../../../services/learnerManagement/hooks';
import CustomParabolaButton from '../component/CustomParabolaButton';
import ContentLayout from '../component/ContentLayout';
import BoxContentSkeleton from '../component/BoxContentSkeleton';
import {deletePortfolio} from '../../../../services/learnerManagement/PortfolioService';
import {isResponseSuccess} from '../../../../@core/utilities/helpers';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {getYouthProfile} from '../../../../services/learnerManagement/YouthService';
import {UPDATE_AUTH_USER} from '../../../../redux/types/actions/Auth.actions';
import {getYouthAuthUserObject} from '../../../../redux/actions';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {useDispatch} from 'react-redux';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import {styled} from '@mui/material/styles';
import {FormPopupNotifyEnum} from '../../../../shared/constants/AppEnums';
import {FORM_POPUP_CLOSE_OPEN_EL_ID} from '../../../../shared/constants/AppConst';

const PREFIX = 'PortfolioSection';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));
const PortfolioSection = () => {
  const {messages} = useIntl();
  const {successStack} = useNotiStack();
  const authUser = useAuthUser<YouthAuthUser>();
  const dispatch = useDispatch();
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [focusEl, setFocusEl] = useState(FormPopupNotifyEnum.FOCUS_NONE);
  const {
    data: portfolios,
    isLoading,
    mutate: mutatePortfolios,
  } = useFetchPortfolios();
  const [isOpenPortfolioAddEditForm, setIsOpenPortfolioAddEditForm] =
    useState<boolean>(false);

  useEffect(() => {
    if (focusEl !== FormPopupNotifyEnum.FOCUS_NONE) {
      let activeStepEl = document.getElementById(
        PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID,
      );
      if (activeStepEl) {
        activeStepEl.focus();
      }
    }
  }, [focusEl]);

  const openPortfolioAddEditForm = useCallback(
    (itemId: number | null = null) => {
      setPortfolioId(itemId);
      setIsOpenPortfolioAddEditForm(true);
      setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_OPEN_EL);
    },
    [],
  );
  const closePortfolioAddEditForm = useCallback(() => {
    setPortfolioId(null);
    setIsOpenPortfolioAddEditForm(false);
    setFocusEl(FormPopupNotifyEnum.FOCUS_FORM_POPUP_CLOSE_EL);
    updateProfile();
    mutatePortfolios();
  }, []);

  const updateProfile = () => {
    (async () => {
      const response = await getYouthProfile();
      if (isResponseSuccess(response) && response.data) {
        dispatch({
          type: UPDATE_AUTH_USER,
          payload: getYouthAuthUserObject({...authUser, ...response.data}),
        });
      }
    })();
  };

  const onDeletePortfolio = useCallback(async (itemId: number) => {
    let response = await deletePortfolio(itemId);
    if (isResponseSuccess(response)) {
      successStack(
        <IntlMessages
          id='common.subject_deleted_successfully'
          values={{subject: <IntlMessages id='common.portfolio' />}}
        />,
      );
      updateProfile();
      mutatePortfolios();
    }
  }, []);

  return (
    <StyledBox>
      <span
        id={PREFIX + FORM_POPUP_CLOSE_OPEN_EL_ID}
        className={classes.visuallyHidden}
        tabIndex={focusEl !== FormPopupNotifyEnum.FOCUS_NONE ? 0 : -1}>
        {messages[`common.${focusEl}`]}
      </span>
      {isOpenPortfolioAddEditForm ? (
        <PortfolioAddEdit
          itemId={portfolioId}
          onClose={closePortfolioAddEditForm}
        />
      ) : (
        <ContentLayout
          title={messages['common.portfolio']}
          isLoading={isLoading}
          actions={
            <CustomParabolaButton
              buttonVariant={'outlined'}
              title={messages['common.add_new_portfolio'] as string}
              aria-label={`${messages['common.add_new_portfolio']} form popup open`}
              icon={<Add />}
              onClick={() => openPortfolioAddEditForm(null)}
              disabled={!Boolean(authUser?.nid_brn_verified_at)}
            />
          }
          contentSkeleton={<BoxContentSkeleton />}>
          <HorizontalLine />
          {!portfolios || portfolios?.length == 0 ? (
            <>
              <Box sx={{display: 'flex'}}>
                <NoDataFoundComponent
                  messageTextType={'inherit'}
                  sx={{marginTop: '10px'}}
                />
              </Box>
            </>
          ) : (
            <Box>
              <CustomCarousel itemsInDesktop={3}>
                {(portfolios || []).map((portfolio: any) => {
                  let filepath = portfolio?.file_path;
                  let fileType = filepath.substring(filepath.length - 3);
                  return (
                    <React.Fragment key={portfolio?.id}>
                      <CardItemWithButton
                        fileType={fileType}
                        portfolio={portfolio}
                        onDeletePortfolio={onDeletePortfolio}
                        onClick={() => openPortfolioAddEditForm(portfolio?.id)}
                      />
                    </React.Fragment>
                  );
                })}
              </CustomCarousel>
            </Box>
          )}
        </ContentLayout>
      )}
    </StyledBox>
  );
};
export default PortfolioSection;
