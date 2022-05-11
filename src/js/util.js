export const qs = document.querySelector.bind(document)
export const qsa = document.querySelectorAll.bind(document)

export const videos = {
    "Ferry square": {
        // todo: generate urls better
        path: "/glitch/src/video/ferry-square.mp4",
    },
    Ink: {
        path: "/glitch/src/video/ink.mp4",
    },
    Motorbike: {
        path: "/glitch/src/video/motorbike.mp4",
    },
    Turbo: {
        path: "/glitch/src/video/turbo.mp4",
    },
};

export class Logger {
    #ul = document.createElement('ul');

    /** @argument {HTMLElement} element */
    constructor(element) {
        this.#ul.className = 'logger'

        element.appendChild(this.#ul)
    }

    clear() {
        this.#ul.innerHTML = ''
    }

    log(text) {
        console.log(text)
        const li = document.createElement('li')
        li.innerText = text
        this.#ul.appendChild(li)
    }
}


export const persist = (element, key) => {
    const found = sessionStorage.getItem(key)
    if (found) { element.value = found };

    element.addEventListener('change', () =>
        sessionStorage.setItem(key, element.value)
    )
}
