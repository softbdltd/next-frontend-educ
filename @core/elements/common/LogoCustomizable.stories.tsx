import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import LogoCustomizable from './LogoCustomizable';

export default {
  title: 'Example/LogoCustomizable',
  component: LogoCustomizable,
  argTypes: {
    backgroundColor: {control: 'color'},
  },
} as ComponentMeta<typeof LogoCustomizable>;

const Template: ComponentStory<typeof LogoCustomizable> = (args) => (
  <LogoCustomizable {...args} />
);

export const withInstituteName = Template.bind({});
withInstituteName.args = {
  instituteName: 'Institute Name',
};
export const withInstituteLogo = Template.bind({});
withInstituteLogo.args = {
  instituteLogo: 'https://thumbs.dreamstime.com/b/apple-logo-19106337.jpg',
};
