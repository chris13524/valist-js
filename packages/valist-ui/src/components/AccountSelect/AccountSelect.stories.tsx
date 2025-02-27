import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as Icon from 'tabler-icons-react';
import { AccountSelect } from './AccountSelect';
import { Button } from '../Button';

export default {
  title: 'AccountSelect',
  component: AccountSelect,
} as ComponentMeta<typeof AccountSelect>;

const Template: ComponentStory<typeof AccountSelect> = (args) => {
  const [value, setValue] = useState('test-1');
  return (
    <AccountSelect {...args} value={value} onChange={setValue}>
      <AccountSelect.Option name="test-1" label="1 project" />
      <AccountSelect.Option name="test-2" label="1 project" />
      <AccountSelect.Option name="test-3" label="1 project" />
      <AccountSelect.Option name="test-4" label="1 project" />
      <AccountSelect.Option name="test-5" label="1 project" />
      <AccountSelect.Option name="test-6" label="1 project" />
      <AccountSelect.Option name="test-7" label="1 project" />
      <AccountSelect.Option name="test-8" label="1 project" />
    </AccountSelect>
  );
};

export const Primary = Template.bind({});

Primary.args = {
  
};
