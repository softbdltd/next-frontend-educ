import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomDateTimeField from './index';

export default {
  title: 'Example/CustomDateTimeField',
  component: CustomDateTimeField,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CustomDateTimeField>;

const Template: ComponentStory<typeof CustomDateTimeField> = (args) => (
  <CustomDateTimeField {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
  register: () => {},
};
export const withSize = Template.bind({});
withSize.args = {
  size: 'medium',
  register: () => {},
};

export const withLabel = Template.bind({});
withLabel.args = {
  label: 'Custom date field',
  register: () => {},
};
