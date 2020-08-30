export default class PreLoader {
  constructor({ element, cssClasses }) {
    typeof element === "object"
      ? (this.element = element)
      : (this.element = document.querySelector(element));
    this.cssClasses = cssClasses;
  }

  show() {
    this.element.style.minWidth = `${this.element.offsetWidth}px`;
    this.element.style.height = `${this.element.offsetHeight}px`;
    this.element.classList.add(...this.cssClasses);
  }

  hide() {
    this.element.classList.remove(...this.cssClasses);
  }
}
