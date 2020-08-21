export default class FlashMessage {
  constructor() {
    this.messageElement = document.getElementById("flashMessage");
  }

  // events
  events() {}

  // methods
  error(message) {
    this.messageElement.textContent = message;
    this.messageElement.classList.add("flashMessage--error");
    this.show();
  }

  warning(message) {
    this.messageElement.textContent = message;
    this.messageElement.classList.add("flashMessage--warning");
    this.show();
  }

  success(message) {
    this.messageElement.textContent = message;
    this.messageElement.classList.add("flashMessage--success");
    this.show();
  }

  show() {
    this.messageElement.classList.add("flashMessage--active");

    setTimeout(() => this.hide(), 3000);
  }

  hide() {
    this.messageElement.textContent = "";
    this.messageElement.removeAttribute("class");
  }
}
