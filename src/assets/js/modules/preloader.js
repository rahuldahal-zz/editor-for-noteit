export default class PreLoader {
  constructor(button) {
    this.button = button;
  }

  show() {
    this.button.style.minWidth = `${this.button.offsetWidth}px`;
    this.button.style.height = `${this.button.offsetHeight}px`;
    this.button.classList.add("preloader", "preloader--accent");
  }

  hide() {
    this.button.classList.remove("preloader", "preloader--accent");
  }
}
