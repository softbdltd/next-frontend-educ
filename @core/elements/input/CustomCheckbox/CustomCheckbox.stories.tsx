import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomCheckbox from './CustomCheckbox';

export default {
  title: 'Example/CustomCheckbox',
  component: CustomCheckbox,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CustomCheckbox>;

const Template: ComponentStory<typeof CustomCheckbox> = (args) => (
  <CustomCheckbox {...args} />
);

export const withLabel = Template.bind({});
withLabel.args = {
  label: 'CheckBox',
  register: () => {},
};
export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
};
export const withChecked = Template.bind({});
withChecked.args = {
  checked: true,
  register: () => {},
};
