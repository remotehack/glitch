function randomise(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function randomiseByX(input, x) {
    const slices = Array.from(Array(Math.floor(input.length / x)).keys()).map(
        (v) => v * x
    );
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

export function randomFrameSlices(chunks, { chunkSize }) {
    const key = chunks.shift();
    const shuffledChunks = randomiseByX(chunks, chunkSize);
    shuffledChunks.unshift(key);
    return shuffledChunks;
}
