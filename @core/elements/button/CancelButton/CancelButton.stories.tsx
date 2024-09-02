import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CancelButton from './CancelButton';

export default {
  title: 'Example/CancelButton',
  component: CancelButton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CancelButton>;

const Template: ComponentStory<typeof CancelButton> = (args) => (
  <CancelButton {...args} />
);

export const withLabel = Template.bind({});
withLabel.args = {
  label: 'Cancel',
};

export const WithIsLoading = Template.bind({});
WithIsLoading.args = {
  isLoading: true,
};
