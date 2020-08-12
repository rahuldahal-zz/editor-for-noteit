export default class ExternalResources {
    constructor() {
        this.events();
    }

    // events
    events() {
        window.addEventListener("DOMContentLoaded", () => this.startFetching());
    }

    // methods

    startFetching() {
        this.fetchIcons();
    }

    fetchIcons() {
        let script = document.createElement("script");
        script.setAttribute("src", "https://friconix.com/cdn/friconix.js");
        document.body.appendChild(script);
    }
}

