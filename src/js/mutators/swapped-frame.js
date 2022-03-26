export function swappedFrame(chunks, { chunk1, chunk2 }) {
    const key = chunks.shift();
    const shuffledChunks = [
        key,
        ...chunks.slice(0, chunk1),
        chunks[chunk2],
        ...chunks.slice(chunk1 + 1, chunk2),
        chunks[chunk1],
        ...chunks.slice(chunk2 + 1),
    ];
    console.log(shuffledChunks);
    return shuffledChunks;
}
