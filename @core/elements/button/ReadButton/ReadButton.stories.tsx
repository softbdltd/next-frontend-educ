import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ReadButton from './ReadButton';

export default {
  title: 'Example/ReadButton',
  component: ReadButton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof ReadButton>;

const Template: ComponentStory<typeof ReadButton> = (args) => (
  <ReadButton {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
};

export const withVariant = Template.bind({});
withVariant.args = {
  variant: 'outlined',
};
