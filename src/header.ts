import Headroom from "headroom.js";

const header = document.querySelector("header");

if (header) {
    const headroom = new Headroom(header);
    headroom.init();
}

