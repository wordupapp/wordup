/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { NewWordsPanel } from './index';

describe.only('NewWordsPanel', () => {
  let newWordsPanel;

  beforeEach(() => {
    newWordsPanel = shallow(<NewWordsPanel />);
  });

  it('renders page header with text in an h1', () => {
    expect(newWordsPanel.find('.panelHeader').text()).to.be.equal('Learn new words');
  });
});
