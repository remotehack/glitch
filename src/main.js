console.log("Helo")

import { MP4Demuxer } from "./mp4/MP4Demuxer.js";

const path = '/motorbike.mp4'


let demuxer = new MP4Demuxer(path);


let maxFrames = 100;
let i = 0;

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const frames = []
let f = 0;
function render() {
    const frame = frames[f++ % frames.length]

    if (frame) {
        ctx.drawImage(frame, 0, 0)
    }
}
setInterval(render, 100)



let decoder = new VideoDecoder({
    output: async (frame) => {

        const bitmap = await createImageBitmap(
            frame
        );
        frames.push(bitmap);
        frame.close()

        if (i++ === maxFrames) {
            console.log("Reached maxFrames");
            decoder.close();
            return;
        }


    },
    error: (e) => console.error(e),
});


const config = await demuxer.getConfig()

decoder.configure(config);

const chunks = await new Promise(resolve => {
    const chunks = []
    demuxer.start((chunk) => {

        if (chunks.push(chunk) === 100) {
            resolve(chunks.slice(0))
        }
    })

})

console.log(chunks)

chunks.splice(1, 20)





for (const chunk of chunks) {
    decoder.decode(chunk);
}


