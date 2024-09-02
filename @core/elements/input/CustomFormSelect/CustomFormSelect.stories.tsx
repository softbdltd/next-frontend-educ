import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomFormSelect from './CustomFormSelect';

export default {
  title: 'Example/CustomFormSelect',
  component: CustomFormSelect,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CustomFormSelect>;

const Template: ComponentStory<typeof CustomFormSelect> = (args) => (
  <CustomFormSelect {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
  control: '',
};

export const withLabel = Template.bind({});
withLabel.args = {
  // options: ['option'],
  // optionValueProp: 'value',
  // optionTitleProp: ['Title'],
  label: 'Form select',
  id: 'ddf',
  isLoading: false,
  control: () => {},
};
