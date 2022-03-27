import { randomFrameSlices } from "./random-frame-slices.js";
import { swappedFrame } from "./swapped-frame.js";
import { deleteFrames } from "./delete-frames.js";
import { reverseFrames } from "./reverse-frames.js";
import { duplicateFrames } from "./duplicate-frames.js";
import { flipBits } from "./flip-bits.js";
import { switchSources } from "./switch-sources.js";

export const mutators = {
    "Random frame slices": {
        mutate: randomFrameSlices,
        description:
            "Splits the encoded frames into chunks and shuffles the chunks.",
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
        description: "Swaps two encoded frames.",
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
        description: "Drops a range of frames.",
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
        description: "Reverses a range of frames.",
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
    "Duplicate frames": {
        mutate: duplicateFrames,
        description: "Duplicates a range of frames.",
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
    "Flip bits": {
        mutate: flipBits,
        description:
            "Flips some bits in a selected frame. This will fail to decode sometimes.",
        args: {
            frame: {
                defaultValue: 10,
                name: "Frame",
                type: "number",
            },
        },
    },
    "Switch sources": {
        mutate: switchSources,
        description:
            "Switches from the original source to new video at given frame. This fails or has anticlimatic results where the decoding config differs.",
        args: {
            frame: {
                defaultValue: 10,
                name: "Frame",
                type: "number",
            },
            video: {
                name: "Video",
                type: "video",
            },
        },
    },
    "No op": {
        mutate: (chunks) => chunks,
        args: {},
    },
};
