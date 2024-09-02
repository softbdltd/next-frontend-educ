import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import FormRadioButtons from './FormRadioButtons';

export default {
  title: 'Example/FormRadioButtons',
  component: FormRadioButtons,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof FormRadioButtons>;

const Template: ComponentStory<typeof FormRadioButtons> = (args) => (
  <FormRadioButtons {...args} />
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
  control: '',
};
