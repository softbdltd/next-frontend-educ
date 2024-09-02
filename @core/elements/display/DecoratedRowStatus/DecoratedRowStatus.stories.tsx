import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import DecoratedRowStatus from './DecoratedRowStatus';

export default {
  title: 'Example/DecoratedRowStatus',
  component: DecoratedRowStatus,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof DecoratedRowStatus>;

const Template: ComponentStory<typeof DecoratedRowStatus> = (args) => (
  <DecoratedRowStatus {...args} />
);

export const withRowStatus = Template.bind({});
withRowStatus.args = {
  rowStatus: 0,
};
