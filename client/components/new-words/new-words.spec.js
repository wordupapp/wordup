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

  it('renders 1 page header', () => {
    expect(newWordsPanel.find('.panelHeader').length).to.be.equal(1);
  });

  it('renders 1 page header content', () => {
    expect(newWordsPanel.find('.panelHeaderContent').length).to.be.equal(1);
  });

  it('renders page header with correct text', () => {
    expect(newWordsPanel.find('.panelHeaderContent > span').text()).to.be.equal('Learn new words');
  });

  it('renders 1 page subheader content', () => {
    expect(newWordsPanel.find('.panelSubHeaderContent').length).to.be.equal(1);
  });

  it('renders page subheader with correct text', () => {
    expect(newWordsPanel.find('.panelSubHeaderContent > span').text()).to.be.equal('learn and up your vocabulary game!');
  });
});
