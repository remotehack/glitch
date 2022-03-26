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

function populateForm() {
    const mutatorSelectElement = document.querySelector("#mutator-input");
    const videoSelectElement = document.querySelector("#video-input");

    console.log(videos, mutators);

    videoSelectElement.innerHTML = Object.keys(videos)
        .map((v) => `<option value="${v}">${v}</option>`)
        .join("");
    mutatorSelectElement.innerHTML = Object.keys(mutators)
        .map((m) => `<option value="${m}">${m}</option>`)
        .join("");
}

window.addEventListener("load", async function () {
    populateForm();

    document
        .querySelector("#start-button")
        .addEventListener("click", function (event) {
            event.preventDefault();

            const formData = new FormData(
                document.querySelector("#options-form")
            );

            const video = videos[formData.get("video")].path;
            const mutator = mutators[formData.get("mutator")];

            run({
                path: video,
                mutator,
            });
        });
});

let currentInterval = undefined;

async function run({ path, mutator }) {
    if (currentInterval !== undefined) {
        clearInterval(currentInterval);
        currentInterval = undefined;
    }

    let demuxer = new MP4Demuxer(path);

    let maxFrames = 100;
    let i = 0;

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const frames = [];
    let f = 0;
    function render() {
        const frame = frames[f++ % frames.length];

        if (frame) {
            ctx.drawImage(frame, 0, 0);
        }
    }
    currentInterval = setInterval(render, 100);

    const decoder = new VideoDecoder({
        output: async (frame) => {
            const bitmap = await createImageBitmap(frame);
            frames.push(bitmap);
            frame.close();

            if (i++ === maxFrames) {
                console.log("Reached maxFrames");
                decoder.close();
                return;
            }
        },
        error: (e) => console.error(e),
    });

    const config = await demuxer.getConfig();

    decoder.configure(config);

    const chunks = await new Promise((resolve) => {
        const chunks = [];
        demuxer.start((chunk) => {
            if (chunks.push(chunk) === 150) {
                resolve(chunks.slice(0));
            }
        });
    });

    const mutatedChunks = mutator.mutate(chunks, mutator.args);

    for (const chunk of mutatedChunks) {
        decoder.decode(chunk);
    }
}
