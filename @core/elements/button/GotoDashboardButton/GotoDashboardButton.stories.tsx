import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import GotoDashboardButton from './GotoDashboardButton';

export default {
  title: 'Example/GotoDashboardButton',
  component: GotoDashboardButton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof GotoDashboardButton>;

const Template: ComponentStory<typeof GotoDashboardButton> = (args) => (
  <GotoDashboardButton {...args} />
);

export const withVariant = Template.bind({});
withVariant.args = {
  variant: 'outlined',
};
