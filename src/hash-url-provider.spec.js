import { spy } from 'sinon';
import { expect } from 'chai';
import HashUrlProvider from './hash-url-provider';

describe('HashUrlProvider', () => {
  const win = {
    addEventListener: spy(),
    removeEventListener: spy(),
    location: {}
  };

  function invokeHashchangeListener() {
    const spy = win.addEventListener;
    const fn = spy.called && spy.getCall(0).args[0] === 'hashchange' ? spy.getCall(0).args[1] : function() {};
    const removeSpy = win.removeEventListener;
    if (removeSpy.called) {
      const [eventName, listener] = removeSpy.getCall(0).args;
      if (eventName === 'hashchange' && listener === fn) {
        return;
      }
    }
    fn();
  }

  afterEach(() => {
    win.addEventListener.reset();
    win.removeEventListener.reset();
    delete win.location.hash;
  });

  describe('when the location hash is initially set to a value', () => {
    const hash = '#/xx';

    beforeEach(() => {
      win.location.hash = hash;
      new HashUrlProvider(win);
    });

    it('should not change the initial location hash', () => {
      expect(win.location.hash).to.equal(hash);
    });
  });

  describe('when the location hash is initially not set to a value', () => {
    let hashUrl;

    beforeEach(() => hashUrl = new HashUrlProvider(win));

    it('should initialize the location hash to #/', () => {
      expect(win.location.hash).to.equal('#/');
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
        let unsubscribe;

        beforeEach(() => {
          win.location.hash = `#${hash}`;
          unsubscribe = hashUrl.observe(callback);
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

          describe('and then the subscription is canceled', () => {
            beforeEach(() => unsubscribe());

            describe('and then the hash changes', () => {
              beforeEach(() => {
                callback.reset();
                invokeHashchangeListener();
              });

              it('should not invoke the callback', () => {
                expect(callback).not.to.have.been.called;
              });
            });
          });
        });
      });
    });
  });
});
