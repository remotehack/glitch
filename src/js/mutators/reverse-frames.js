function reverse(array) {
    array.reverse();
    return array;
}

export function reverseFrames(chunks, { start, end }) {
    const key = chunks.shift();
    const shuffledChunks = [
        key,
        ...chunks.slice(0, start),
        ...reverse(chunks.slice(start, end)),
        ...chunks.slice(end),
    ];
    console.log(shuffledChunks);
    return shuffledChunks;
}
