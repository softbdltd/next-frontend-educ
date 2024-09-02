import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import CustomChip from './CustomChip';

export default {
  title: 'Example/CustomChip',
  component: CustomChip,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof CustomChip>;

const Template: ComponentStory<typeof CustomChip> = (args) => (
  <CustomChip {...args} />
);

export const withColor = Template.bind({});
withColor.args = {
  color: 'default',
};
export const withLabel = Template.bind({});
withLabel.args = {
  label: 'Chip',
};

export const withVariant = Template.bind({});
withVariant.args = {
  variant: 'outlined',
};
