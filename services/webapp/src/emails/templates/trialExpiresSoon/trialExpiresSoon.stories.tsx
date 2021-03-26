import React from 'react';
import { Story } from '@storybook/react';
import { EmailStory } from '../../emailStory/emailStory.component';
import { EmailTemplateType } from '../../types';
import {
  Subject as TrialExpiresSoonSubject,
  Template as TrialExpiresSoonEmail,
  TrialExpiresSoonProps,
} from './trialExpiresSoon.component';

const Template: Story<TrialExpiresSoonProps> = (args) => (
  <EmailStory type={EmailTemplateType.TrialExpiresSoon} subject={<TrialExpiresSoonSubject />} emailData={args}>
    <TrialExpiresSoonEmail {...args} />
  </EmailStory>
);

export default {
  title: 'Emails/TrialExpiresSoon',
  component: TrialExpiresSoonEmail,
};

export const Primary = Template.bind({});
Primary.args = {
  expiryDate: '10/10/2020',
};
