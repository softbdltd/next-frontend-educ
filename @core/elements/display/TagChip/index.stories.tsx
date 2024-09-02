import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TagChip from './index';

export default {
  title: 'Example/TagChip',
  component: TagChip,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof TagChip>;

const Template: ComponentStory<typeof TagChip> = (args) => (
  <TagChip {...args} />
);

export const withLabel = Template.bind({});
withLabel.args = {
  label: 'TagChip',
};
