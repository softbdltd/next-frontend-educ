import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomCarousel from './CustomCarousel';
import {Box} from '@mui/material';

export default {
  title: 'Example/CustomCarousel',
  component: CustomCarousel,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CustomCarousel>;

const Template: ComponentStory<typeof CustomCarousel> = (args) => (
  <CustomCarousel {...args} />
);

export const withChildren = Template.bind({});
withChildren.args = {
  children: <Box>Custom Carousel</Box>,
};
