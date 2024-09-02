import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import DeleteButton from './DeleteButton';

export default {
  title: 'Example/DeleteButton',
  component: DeleteButton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof DeleteButton>;

const Template: ComponentStory<typeof DeleteButton> = (args) => (
  <DeleteButton {...args} />
);

export const withTitle = Template.bind({});
withTitle.args = {
  deleteTitle: 'Delete',
};
