import { spy } from 'sinon';
import { expect } from 'chai';
import HashUrlProvider from './hash-url-provider';

describe('HashUrlProvider', () => {
  const win = {
    addEventListener: spy(),
    location: {}
  };

  function invokeHashchangeListener() {
    const spy = win.addEventListener;
    const fn = spy.called && spy.getCall(0).args[0] === 'hashchange' ? spy.getCall(0).args[1] : function() {};
    fn();
  }

  let hashUrl;

  beforeEach(() => hashUrl = new HashUrlProvider(win));

  afterEach(() => {
    win.addEventListener.reset();
    delete win.location.hash;
  });

  describe('get', () => {
    const hash = '/aa/bb/cc';

    beforeEach(() => win.location.hash = `#${hash}`);

    it('should return the location hash', () => {
      expect(hashUrl.get()).to.equal(hash);
    });
  });

  describe('set', () => {
    describe('when called with /x/y/z', () => {
      const newUrl = '/x/y/z';

      beforeEach(() => hashUrl.set(newUrl));

      it('should update the location hash to /x/y/z', () => {
        expect(win.location.hash).to.equal(`#${newUrl}`);
      });
    });
  });

  describe('observe', () => {
    describe('when invoked with a callback', () => {
      const callback = spy();
      const hash = '/';

      beforeEach(() => {
        win.location.hash = `#${hash}`;
        hashUrl.observe(callback);
      });

      afterEach(() => callback.reset());

      it('should invoke the callback with the current hash', () => {
        expect(callback).to.have.been.calledWith(hash);
      });

      describe('and then the hash changes', () => {
        const hash = '/a/b/c';

        beforeEach(() => {
          win.location.hash = `#${hash}`;
          invokeHashchangeListener();
        });

        it('should invoke the callback with the updated hash', () => {
          expect(callback).to.have.been.calledWith(hash);
        });
      });
    });
  });
});
