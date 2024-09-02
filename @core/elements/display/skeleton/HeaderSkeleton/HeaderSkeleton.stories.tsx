import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import HeaderSkeleton from './HeaderSkeleton';

export default {
  title: 'Example/HeaderSkeleton',
  component: HeaderSkeleton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof HeaderSkeleton>;

const Template: ComponentStory<typeof HeaderSkeleton> = (args) => (
  <HeaderSkeleton {...args} />
);

export const withChildren = Template.bind({});
withChildren.args = {};
