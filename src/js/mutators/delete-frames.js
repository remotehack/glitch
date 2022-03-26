export function deleteFrames(chunks, { start, end }) {
    const key = chunks.shift();
    const shuffledChunks = [
        key,
        ...chunks.slice(0, start),
        ...chunks.slice(end),
    ];
    console.log(shuffledChunks);
    return shuffledChunks;
}
