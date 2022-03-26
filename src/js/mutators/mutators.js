import { randomFrameSlices } from "./random-frame-slices.js";

export const mutators = {
    "Random frame slices": {
        mutate: randomFrameSlices,
        args: {
            chunkSize: 15,
        },
    },
};
