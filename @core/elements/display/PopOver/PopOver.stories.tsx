import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ActionPopUp from './ActionPopUp';

export default {
  title: 'Example/ActionPopUp',
  component: ActionPopUp,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof ActionPopUp>;

const Template: ComponentStory<typeof ActionPopUp> = (args) => (
  <ActionPopUp {...args} />
);

export const withOpen = Template.bind({});
withOpen.args = {
  open: true,
};
