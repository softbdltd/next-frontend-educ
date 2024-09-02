import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomChipRowStatus from './CustomChipRowStatus';

export default {
  title: 'Example/CustomChipRowStatus',
  component: CustomChipRowStatus,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CustomChipRowStatus>;

const Template: ComponentStory<typeof CustomChipRowStatus> = (args) => (
  <CustomChipRowStatus {...args} />
);

export const withValue = Template.bind({});
withValue.args = {
  value: 1,
};
export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: false,
};
export const withLabel = Template.bind({});
withLabel.args = {
  label: 'Row Status',
};
