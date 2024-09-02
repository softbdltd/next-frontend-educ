import React from 'react';
import {CheckCircleOutline} from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import {MessageFormatElement} from '@formatjs/icu-messageformat-parser';
import TextInputSkeleton from "../../../@core/elements/display/skeleton/TextInputSkeleton/TextInputSkeleton";
import {Fonts} from "../../../shared/constants/AppEnums";
import {FormLabel} from "@mui/material";
import IntlMessages from "../../../@core/utility/IntlMessages";
import CustomChip from "../../../@core/elements/display/CustomChip/CustomChip";

type Props = {
    value: number;
    isLoading?: boolean;
    label?: string | MessageFormatElement[];
};

const InterviewChipRowStatus = ({value, isLoading, label}: Props) => {
    return isLoading ? (
        <TextInputSkeleton/>
    ) : (
        <>
            {label && (
                <FormLabel
                    sx={{
                        fontWeight: Fonts.BOLD,
                        fontSize: '14px',
                        marginBottom: '12px',
                        display: 'block',
                    }}>
                    {label}
                </FormLabel>
            )}
            <CustomChip
                icon={
                    value == 1 ? (
                        <CheckCircleOutline fontSize={'small'}/>
                    ) : (
                        <CancelIcon fontSize={'small'}/>
                    )
                }
                color={value == 1 ? 'primary' : 'secondary'}
                label={
                    value == 1 ? (
                        <IntlMessages id='common.interviewed'/>
                    ) : (
                        <IntlMessages id='common.not_interviewed'/>
                    )
                }
            />
        </>
    );
};

export default React.memo(InterviewChipRowStatus);
