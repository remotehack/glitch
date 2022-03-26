import { randomFrameSlices } from "./random-frame-slices.js";
import { swappedFrame } from "./swapped-frame.js";

export const mutators = {
    "Random frame slices": {
        mutate: randomFrameSlices,
        args: {
            chunkSize: {
                defaultValue: 15,
                name: "Random chunk size",
                type: "number",
            },
        },
    },
    "Swap frames": {
        mutate: swappedFrame,
        args: {
            chunk1: {
                defaultValue: 10,
                name: "Frame 1",
                type: "number",
            },
            chunk2: {
                defaultValue: 10,
                name: "Frame 2",
                type: "number",
            },
        },
    },
    "No op": {
        mutate: (chunks) => chunks,
        args: {},
    },
};
