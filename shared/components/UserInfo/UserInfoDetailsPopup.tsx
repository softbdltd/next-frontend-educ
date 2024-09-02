import IconRole from '../../../@core/icons/IconRole';
import {styled} from '@mui/material/styles';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CustomDetailsViewMuiModal from '../../../@core/modals/CustomDetailsViewMuiModal/CustomDetailsViewMuiModal';
import Grid from '@mui/material/Grid';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useIntl} from 'react-intl';
import Avatar from '@mui/material/Avatar';
import EditButton from '../../../@core/elements/button/EditButton/EditButton';
import {Button} from '@mui/material';
import {Link} from '../../../@core/elements/common';
import AvatarImageView from '../../../@core/elements/display/ImageView/AvatarImageView';

const PREFIX = 'UserInfoDetailsPopup';

const classes = {
  ProfileImage: `${PREFIX}-ProfileImage`,
  noProfileImage: `${PREFIX}-noProfileImage`,
};

const StyledCustomDetailsViewMuiModal = styled(CustomDetailsViewMuiModal)({
  [`& .${classes.ProfileImage}`]: {
    height: '100px',
    width: '100px',
  },
  [`& .${classes.noProfileImage}`]: {
    height: '50px',
    width: '50px',
  },
});

type Props = {
  onClose: () => void;
  openEditModal: () => void;
};

export default function UserInfoDetailsPopup({onClose, openEditModal}: Props) {
  const authUser = useAuthUser<CommonAuthUser>();
  const {messages} = useIntl();

  return (
    <StyledCustomDetailsViewMuiModal
      open={true}
      onClose={onClose}
      title={
        <>
          <IconRole />
          <IntlMessages id='my_account.label' />
        </>
      }
      maxWidth={'md'}
      actions={
        <>
          <Button variant='outlined' size='medium'>
            <Link href='/update-password'>
              {messages['common.change_password']}
            </Link>
          </Button>
          <EditButton onClick={() => openEditModal()} />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          {authUser?.profile_pic ? (
            <AvatarImageView
              className={classes.ProfileImage}
              src={authUser?.profile_pic}
            />
          ) : (
            <Avatar className={classes.noProfileImage}>
              {authUser?.displayName?.charAt(0)}
            </Avatar>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.name']}
            value={authUser?.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.name_en']}
            value={authUser?.displayName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.user_name']}
            value={authUser?.username}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.email']}
            value={authUser?.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['common.mobile']}
            value={authUser?.mobile}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DetailsInputView
            label={messages['role.label']}
            value={authUser?.role?.title}
          />
        </Grid>
      </Grid>
    </StyledCustomDetailsViewMuiModal>
  );
}
