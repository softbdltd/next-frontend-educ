import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import SubmitButton from './SubmitButton';

export default {
  title: 'Example/SubmitButton',
  component: SubmitButton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof SubmitButton>;

const Template: ComponentStory<typeof SubmitButton> = (args) => (
  <SubmitButton {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
};
export const withIsSubmitting = Template.bind({});
withIsSubmitting.args = {
  isSubmitting: true,
};

export const withLabel = Template.bind({});
withLabel.args = {
  label: 'Submit',
};
