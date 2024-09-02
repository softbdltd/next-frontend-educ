import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import EditButton from './EditButton';

export default {
  title: 'Example/EditButton',
  component: EditButton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof EditButton>;

const Template: ComponentStory<typeof EditButton> = (args) => (
  <EditButton {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
};

export const withVariant = Template.bind({});
withVariant.args = {
  variant: 'outlined',
};

export const withColor = Template.bind({});
withColor.args = {
  color: 'inherit',
};
