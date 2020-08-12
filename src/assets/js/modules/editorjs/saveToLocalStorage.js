export default class LocalStorage {
  constructor(data) {
    this.data = data;
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    console.log("I am gonna save your progress...");

    let dataToSave = JSON.stringify(this.data);
    window.localStorage.setItem("progress", dataToSave);
  }
}
