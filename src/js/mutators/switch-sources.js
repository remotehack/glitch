export async function switchSources(chunks, { frame, video }) {
    const key = chunks.shift();
    const shuffledChunks = [
        key,
        ...chunks.slice(0, frame),
        ...video.slice(frame),
    ];
    console.log(shuffledChunks);
    return shuffledChunks;
}
