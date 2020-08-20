export default class SubmitNote {
  constructor(token) {
    this.token = token;
    this.formWrapper = document.getElementById("submitNoteFormWrapper");
    this.fade = document.getElementById("fade");
    console.log("token in submitnote", this.token);
    this.setToken();
    this.toggleFormWrapper();
    this.form = document.getElementById("submitNoteForm");
    this.token = document.getElementById("token").value;
    this.output = document.getElementById("output");
    this.events();
  }

  // events
  events() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log(e.target);
      this.getNoteDetails();
      this.parseOutputAndSendRequestToLambda();
    });
  }

  // methods

  toggleFormWrapper() {
    this.fade.classList.toggle("visible");
    this.formWrapper.classList.toggle("formWrapper--active");
    this.fade.addEventListener("click", () => this.toggleFormWrapper()); // this is here because if it was in the events(), it would get called only one time, when the events() gets invoked.
  }

  setToken() {
    console.log("setting token", this.token);
    document.getElementById("token").value = this.token;
  }

  getNoteDetails() {
    this.token = document.getElementById("token").value;
    const unit = document.getElementById("unit").value;
    const title = document.getElementById("title").value;
    const subject = document.getElementById("subject").value;
    const faculty = document.getElementById("faculty").value;
    const semester = document.getElementById("semester").value;
    this.noteDetails = {
      unit,
      title,
      subject,
      faculty,
      semester,
    };
  }

  // send this via lambda function

  parseOutputAndSendRequestToLambda() {
    const parsedHTML = this.output.innerHTML;
    console.log("sending request to lambda submitNote...");
    fetch("/submitNote", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: this.token,
        details: this.noteDetails,
        note: parsedHTML,
      }),
    })
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }
}
