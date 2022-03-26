import { randomFrameSlices } from "./random-frame-slices.js";
import { swappedFrame } from "./swapped-frame.js";
import { deleteFrames } from "./delete-frames.js";
import { reverseFrames } from "./reverse-frames.js";

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
    "Delete frames": {
        mutate: deleteFrames,
        args: {
            start: {
                defaultValue: 10,
                name: "First frame",
                type: "number",
            },
            end: {
                defaultValue: 20,
                name: "Last frame",
                type: "number",
            },
        },
    },
    "Reverse frames": {
        mutate: reverseFrames,
        args: {
            start: {
                defaultValue: 10,
                name: "First frame",
                type: "number",
            },
            end: {
                defaultValue: 20,
                name: "Last frame",
                type: "number",
            },
        },
    },
    "No op": {
        mutate: (chunks) => chunks,
        args: {},
    },
};
