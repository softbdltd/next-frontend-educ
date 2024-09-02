import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import SideMenu from './index';

export default {
  title: 'Example/SideMenu',
  component: SideMenu,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof SideMenu>;

const Template: ComponentStory<typeof SideMenu> = (args) => (
  <SideMenu {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {};
