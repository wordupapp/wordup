import React from 'react';
import { createStore } from 'redux';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import SynonymGame from './index';
import SynonymInstructions from './SynonymInstructions';

chai.use(chaiEnzyme());
chai.use(sinonChai);

sinon.spy(SynonymGame.prototype, 'componentDidMount');

describe('<SynonymFame />', () => {
  it('calls ComponentDidMount', () => {
    const wrapper = mount(<SynonymGame />);
    expect(SynonymGame.prototype.coponentDidMount.calledOnce).to.equal(true);
  });
});
