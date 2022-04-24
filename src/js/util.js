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
