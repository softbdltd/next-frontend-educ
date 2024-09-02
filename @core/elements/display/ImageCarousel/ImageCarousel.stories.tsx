import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ImageCarousel from './ImageCarousel';

export default {
  title: 'Example/ImageCarousel',
  component: ImageCarousel,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof ImageCarousel>;

const Template: ComponentStory<typeof ImageCarousel> = (args) => (
  <ImageCarousel {...args} />
);

export const withChildren = Template.bind({});
withChildren.args = {};
