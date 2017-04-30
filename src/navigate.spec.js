import { expect } from 'chai';
import navigate from './navigate';

describe('navigate', () => {
  afterEach(() => location.hash = '');

  it('should change the location hash to the specified URL', () => {
    navigate('/whatever');
    expect(location.hash).to.equal('#/whatever');
  });
});
