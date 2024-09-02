import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomTextInput from './CustomTextInput';

export default {
  title: 'Example/CustomTextInput',
  component: CustomTextInput,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CustomTextInput>;

const Template: ComponentStory<typeof CustomTextInput> = (args) => (
  <CustomTextInput {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
  register: () => {},
};

export const withSize = Template.bind({});
withSize.args = {
  size: 'small',
  register: () => {},
};

export const withVariant = Template.bind({});
withVariant.args = {
  variant: 'filled',
  register: () => {},
};
