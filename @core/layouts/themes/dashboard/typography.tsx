import {Theme} from '@mui/system';
import {TypographyOptions} from '@mui/material/styles/createTypography';

export default function typography(theme: Theme) {
    const customTypography: TypographyOptions = {

        [`${theme.breakpoints.only("sm")}`]: {
            h1: {
                fontSize: "12px",
            }
        }
    };

    return customTypography;
}
