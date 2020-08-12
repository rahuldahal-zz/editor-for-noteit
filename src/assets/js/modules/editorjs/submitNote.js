export default class SubmitNote {
  constructor() {
    this.form = document.getElementById("submitNote");
    this.token = document.getElementById("token").value;
    this.output = document.getElementById("output");
    this.events();
  }

  // events
  events() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.parseAndSend();
    });
  }

  // methods

  parseAndSend() {
    const parsedHTML = this.output.innerHTML;
    const API_URL =
      "https://mynoteit.herokuapp.com/api/contributors/submitNote";
    fetch(API_URL, {
      method: "post",
      body: {
        note: JSON.stringify(parsedHTML),
      },
    });
  }
}
