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


const chunks = []

async function run(path) {

    // load video 
    let demuxer = new MP4Demuxer(path);

    const config = await demuxer.getConfig();
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


    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const ordered = []
        let timestamp = 0;//or 2048?

        for (const child of frameList.children) {
            const sample = chunks[child.dataset.idx]
            const type = sample.is_sync ? "key" : "delta"

            const chunk = new EncodedVideoChunk({
                type: type,
                timestamp: sample.cts,
                duration: sample.duration,
                data: sample.data,
            });

            ordered.push(chunk)

            timestamp += chunk.duration
        }

        console.log("ORDERED", ordered)
    })

}



