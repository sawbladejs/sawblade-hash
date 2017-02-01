export default class HashUrlProvider {
  constructor(win) {
    this.window = win || window;
    const { location } = this.window;
    location.hash = location.hash || '#/';
  }

  get() {
    return (this.window.location.hash || '').substring(1);
  }

  set(url) {
    this.window.location.hash = `#${url}`;
  }

  observe(callback) {
    callback(this.get());
    const listener = () => callback(this.get());
    this.window.addEventListener('hashchange', listener);
    return () => this.window.removeEventListener('hashchange', listener);
  }
}
