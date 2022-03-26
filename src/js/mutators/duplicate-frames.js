export function duplicateFrames(chunks, { start, end }) {
    const key = chunks.shift();
    const shuffledChunks = [
        key,
        ...chunks.slice(0, start),
        ...chunks.slice(start, end),
        ...chunks.slice(start, end),
        ...chunks.slice(end),
    ];
    console.log(shuffledChunks);
    return shuffledChunks;
}
