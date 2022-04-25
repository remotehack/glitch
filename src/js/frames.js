import { MP4Demuxer } from "./mp4/MP4Demuxer.js";
import { videos, persist, qs } from "./util.js";
import { Sortable, MultiDrag } from 'https://cdn.skypack.dev/sortablejs';

Sortable.mount(new MultiDrag());

const form = qs('form')
const videoInput = qs('[name=video]')
const frameList = qs('ul#frames')

for (const [name, { path }] of Object.entries(videos)) {
    const option = document.createElement('option')
    option.innerText = name
    option.value = path

    videoInput.appendChild(option)
}

persist(videoInput)


if (videoInput.value) run(videoInput.value)
videoInput.addEventListener('change', () => run(videoInput.value))

Sortable.create(frameList, { multiDrag: true })


let config;
const chunks = []

async function run(path) {

    // load video 
    let demuxer = new MP4Demuxer(path);

    config = await demuxer.getConfig();
    console.log(config)

    frameList.innerHTML = ''

    // clear chunks
    chunks.splice(0, chunks.length)

    demuxer.start((chunk) => {
        const idx = chunks.push(chunk) - 1

        const li = document.createElement('li')
        li.innerText = (idx).toString().padStart(4, '0')
        li.className = `type-${chunk.is_sync ? "key" : "delta"}`

        li.dataset.idx = idx

        frameList.appendChild(li)
    }, true);


}


// import WebMWriter from './mp4/webm-writer2.js';

let currentInterval;


form.addEventListener('submit', async (e) => {
    e.preventDefault()


    // const maxFrames = 150;

    const canvas = document.createElement("canvas");
    canvas.width = config.codedWidth
    canvas.height = config.codedHeight
    document.body.append(canvas)
    const ctx = canvas.getContext("2d");
    const frames = [];
    let f = 0;
    function render() {
        const frame = frames[f++ % frames.length];

        if (frame) {
            ctx.drawImage(frame, 0, 0);
        }
    }
    currentInterval = setInterval(render, 50);

    const decoder = new VideoDecoder({
        output: async (frame) => {
            const bitmap = await createImageBitmap(frame);
            frames.push(bitmap);
            frame.close();
        },
        error: (e) => logger.log(`Error: ${e}`)
    });

    // const config = await demuxer.getConfig();

    decoder.configure(config);

    // const chunks = await new Promise((resolve) => {
    //     const chunks = [];
    //     demuxer.start((chunk) => {
    //         if (chunks.push(chunk) === maxFrames) {
    //             resolve(chunks.slice(0));
    //         }
    //     });
    // });



    // const webmWriter = new WebMWriter({
    //     fileWriter: null,
    //     codec: 'VP9',
    //     width: config.codedWidth,
    //     height: config.codedHeight
    // });

    const ordered = []
    let timestamp = 2048;// 0;//or 2048?

    for (const child of frameList.children) {
        const sample = chunks[child.dataset.idx]
        const type = sample.is_sync ? "key" : "delta"

        const chunk = new EncodedVideoChunk({
            type: type,
            timestamp: timestamp,
            duration: sample.duration,
            data: sample.data,
        });

        ordered.push(chunk)


        decoder.decode(chunk)

        // webmWriter.addFrame(chunk);

        timestamp += chunk.duration
        console.log(timestamp)
    }

    console.log("ORDERED", ordered)


    // const blob = await webmWriter.complete()

    // console.log(blob)
    // // debugger;
    // const url = URL.createObjectURL(blob)
    // console.log(url)

    // const video = document.createElement('video')
    // video.controls = true
    // // video.srcObject = blob;
    // video.src = url;

    // document.body.append(video)


})
