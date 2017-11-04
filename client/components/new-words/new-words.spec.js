/* global describe beforeEach it */

import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import { NewWords } from './index';

describe('NewWords', () => {
  let newWords;

  beforeEach(() => {
    newWords = shallow(<NewWords email={'cody@email.com'} />);
  });

  it('renders the email in an h3', () => {
    expect(newWords.find('h3').text()).to.be.equal('Welcome, cody@email.com');
  });
});
