import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import TableSkeleton from './TableSkeleton';

export default {
  title: 'Example/TableSkeleton',
  component: TableSkeleton,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof TableSkeleton>;

const Template: ComponentStory<typeof TableSkeleton> = (args) => (
  <TableSkeleton {...args} />
);

export const withColumnNumbers = Template.bind({});
withColumnNumbers.args = {
  columnNumbers: 4,
};
export const withRowSize = Template.bind({});
withRowSize.args = {
  rowSize: 4,
};
