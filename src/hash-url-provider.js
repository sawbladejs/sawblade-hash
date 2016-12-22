export default class HashUrlProvider {
  constructor(win) {
    this.window = win || window;
  }

  watch(callback) {
    callback(this.window.location.hash.replace('#', ''));
    this.window.addEventListener('hashchange', () => callback(this.window.location.hash.replace('#', '')));
  }

  navigate(url) {
    this.window.location.hash = `#${url}`;
  }
}
