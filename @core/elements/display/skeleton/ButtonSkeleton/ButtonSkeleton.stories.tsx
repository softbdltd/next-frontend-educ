import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ButtonSkeleton from './ButtonSkeleton';

export default {
  title: 'Example/ButtonSkeleton',
  component: ButtonSkeleton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof ButtonSkeleton>;

const Template: ComponentStory<typeof ButtonSkeleton> = (args) => (
  <ButtonSkeleton {...args} />
);

export const withIsCircle = Template.bind({});
withIsCircle.args = {
  isCircle: true,
};
