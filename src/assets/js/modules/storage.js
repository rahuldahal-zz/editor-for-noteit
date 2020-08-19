export default class Storage {
  constructor(storageType, { identifier, data }) {
    this.storageType = storageType;
    this.identifier = identifier;
    this.data = data;

    if ((!this.data && !this.identifier) || typeof this.identifier !== "string")
      return;
    if (this.identifier && !this.data) return this.get();
    if (this.identifier && this.data) return this.save();
  }

  save() {
    console.log("I am gonna save your progress...");

    let dataToSave = JSON.stringify(this.data);
    window[this.storageType].setItem(this.identifier, dataToSave);
    return;
  }

  get() {
    const data = window[this.storageType].getItem(this.identifier);
    return JSON.parse(data);
  }
}
