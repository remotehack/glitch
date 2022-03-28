import { MP4Demuxer } from "./mp4/MP4Demuxer.js";
import { mutators } from "./mutators/mutators.js";

const videos = {
    "Ferry square": {
        path: "/video/ferry-square.mp4",
    },
    Ink: {
        path: "/video/ink.mp4",
    },
    Motorbike: {
        path: "/video/motorbike.mp4",
    },
    Turbo: {
        path: "/video/turbo.mp4",
    },
};

const maxFrames = 150;

function populateForm() {
    const mutatorDescriptionElement = document.querySelector(
        "#mutator-description"
    );
    const mutatorSelectElement = document.querySelector("#mutator-input");
    const videoSelectElement = document.querySelector("#video-input");

    console.log(videos, mutators);

    const videoOptions = Object.keys(videos)
        .map((v) => `<option value="${v}">${v}</option>`)
        .join("");

    videoSelectElement.innerHTML = videoOptions;
    mutatorSelectElement.innerHTML = Object.keys(mutators)
        .map((m) => `<option value="${m}">${m}</option>`)
        .join("");

    mutatorSelectElement.addEventListener("change", addAdditionalInputs);
    addAdditionalInputs();

    function addAdditionalInputs() {
        const additionalArgs = mutators[mutatorSelectElement.value].args;

        mutatorDescriptionElement.innerText =
            mutators[mutatorSelectElement.value].description;

        let argsInputHtml = Object.entries(additionalArgs)
            .map(([argName, { name, defaultValue, type }]) => {
                switch (type) {
                    case "number":
                        return `
                            <label for="${argName}-input">${name}</label>
                            <input id="${argName}-input" name="${argName}-arg" value="${defaultValue}" type="number">
                        `;
                    case "video":
                        return `
                            <label for="${argName}-input">${name}</label>
                            <select id="${argName}-input" name="${argName}-arg" value="${defaultValue}">
                                ${videoOptions}
                            </select>
                        `;
                    default:
                        return `
                            <label for="${argName}-input">${name}</label>
                            <input id="${argName}-input" name="${argName}-arg" value="${defaultValue}">
                        `;
                }
            })
            .join("");

        document.querySelector("#additional-inputs").innerHTML = argsInputHtml;
    }
}

window.addEventListener("load", async function () {
    populateForm();

    document
        .querySelector("#start-button")
        .addEventListener("click", async function (event) {
            event.preventDefault();

            const formData = new FormData(
                document.querySelector("#options-form")
            );

            const video = videos[formData.get("video")].path;
            const mutator = mutators[formData.get("mutator")];

            const additionalArgs = Object.entries(mutator.args).map(
                ([key, { type }]) => {
                    const value = formData.get(key + "-arg");
                    console.log(value);
                    switch (type) {
                        case "number":
                            return [key, parseFloat(value)];
                        case "video":
                            return [
                                key,
                                (async () =>
                                    (await loadChunks(videos[value].path))
                                        .chunks)(),
                            ];
                        default:
                            return [key, value];
                    }
                }
            );

            /* Some of the values will be promises, so let's resolve them. */
            const args = await resolveArgs(additionalArgs);

            run({
                path: video,
                mutator,
                args,
            });
        });
});

async function resolveArgs(args) {
    const newArgs = {};
    for (const [key, value] of args) {
        newArgs[key] = await value;
    }
    return newArgs;
}

let currentInterval = undefined;

async function run({ path, mutator, args }) {
    console.log(args);
    if (currentInterval !== undefined) {
        clearInterval(currentInterval);
        currentInterval = undefined;
    }

    const { chunks, config } = await loadChunks(path, maxFrames);

    const mutatedChunks = await mutator.mutate(chunks, args);

    const decoder = new VideoDecoder({
        output: async (frame) => {
            const bitmap = await createImageBitmap(frame);
            frames.push(bitmap);
            frame.close();
        },
        error: (e) => console.error(e),
    });

    decoder.configure(config);

    for (const chunk of mutatedChunks) {
        decoder.decode(chunk);
    }

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const frames = [];
    let f = 0;
    function render() {
        const frame = frames[f++ % frames.length];

        if (frame) {
            canvas.width = frame.width
            canvas.height = frame.height
            ctx.drawImage(frame, 0, 0);
        }
    }
    currentInterval = setInterval(render, 100);
}

async function loadChunks(path) {
    let demuxer = new MP4Demuxer(path);

    const config = await demuxer.getConfig();

    console.log(path, config);

    return {
        chunks: await new Promise((resolve) => {
            const chunks = [];
            demuxer.start((chunk) => {
                if (chunks.push(chunk) === maxFrames) {
                    resolve(chunks.slice(0));
                }
            });
        }),
        config,
    };
}
