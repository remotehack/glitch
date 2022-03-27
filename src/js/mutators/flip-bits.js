function flipBitsInFrame(frame) {
    const buffer = new ArrayBuffer(frame.byteLength);
    frame.copyTo(buffer);

    const byteBuffer = new Uint8Array(buffer);

    const bit = Math.floor(buffer.byteLength * Math.random());

    const flippedBuffer = Uint8Array.from(
        Array.from(byteBuffer).map((x, i) => (Math.random() < 0.1 ? ~x : x))
    );

    return new EncodedVideoChunk({
        type: "delta",
        data: flippedBuffer.buffer,
        timestamp: frame.timestamp,
        duration: frame.duration,
    });
}

export function flipBits(chunks, { frame }) {
    const key = chunks.shift();
    const shuffledChunks = [
        key,
        ...chunks.slice(0, frame),
        flipBitsInFrame(chunks[frame]),
        ...chunks.slice(frame + 1),
    ];
    return shuffledChunks;
}
