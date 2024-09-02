import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import DetailsInputView from './DetailsInputView';

export default {
  title: 'Example/DetailsInputView',
  component: DetailsInputView,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof DetailsInputView>;

const Template: ComponentStory<typeof DetailsInputView> = (args) => (
  <DetailsInputView {...args} />
);

export const withLabel = Template.bind({});
withLabel.args = {
  label: 'Input',
};
export const withIsLoading = Template.bind({});
withIsLoading.args = {
  isLoading: true,
};
export const withValue = Template.bind({});
withValue.args = {
  value: 'value',
};
