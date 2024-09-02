import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TextInputSkeleton from './TextInputSkeleton';

export default {
  title: 'Example/TextInputSkeleton',
  component: TextInputSkeleton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof TextInputSkeleton>;

const Template: ComponentStory<typeof TextInputSkeleton> = (args) => (
  <TextInputSkeleton {...args} />
);

export const withChildren = Template.bind({});
withChildren.args = {};
