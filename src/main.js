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



const decoder = new VideoDecoder({
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

        if (chunks.push(chunk) === 150) {
            resolve(chunks.slice(0))
        }
    })

})

console.log(chunks)

function chop(array) {

}


function randomise(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function randomiseByX(input, x) {

    const slices = Array.from(Array(Math.floor(input.length / x)).keys()).map(v => v * x);
    randomise(slices);
    console.log(slices);
    let output = [];

    for (let i = 0; i < slices.length; i++) {
        const v = slices[i];

        const slice = input.slice(v, Math.min(v + x, input.length));

        output = [...output, ...slice];
    }

    return output;
}

const key = chunks.shift();
console.log(key)
const shuffledChunks = randomiseByX(chunks, 15);
console.log(shuffledChunks);
shuffledChunks.unshift(key);

for (const chunk of shuffledChunks) {
    decoder.decode(chunk);
}

