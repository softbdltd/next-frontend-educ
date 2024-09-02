import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import FormRowStatus from './FormRowStatus';

export default {
  title: 'Example/FormRowStatus',
  component: FormRowStatus,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof FormRowStatus>;

const Template: ComponentStory<typeof FormRowStatus> = (args) => (
  <FormRowStatus {...args} />
);

export const withIsLoading = Template.bind({});
withIsLoading.args = {
  id: '1',
  isLoading: true,
  control: () => {},
};
