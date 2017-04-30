import { expect } from 'chai';
import url from './url';

describe('url', () => {
  let subscription, current;

  beforeEach(() => subscription = url.subscribe(url => current = url));

  afterEach(() => {
    subscription.unsubscribe();
    location.hash = '';
  });

  it('should immediately emit a URL upon subscription', () => {
    expect(current).not.to.be.undefined;
    expect(current).not.to.be.null;
  });

  it('should emit a URL when the location hash changes', () => {
    location.hash = '#/a/b/c';
    window.dispatchEvent(new Event('hashchange', { bubbles: true, cancelable: false }));
    expect(current).to.equal('/a/b/c');
  });
});
