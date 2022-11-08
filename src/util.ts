const genAtlasJson = (
    filePrfix: string,
    width: number,
    height: number,
    size: { x: number; y: number }
) => {
    let ret: any = {
        frames: [],
    };

    let count = 0;

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            ret.frames.push({
                filename: filePrfix + "_" + count.toString(),
                frame: {
                    w: size.x,
                    h: size.y,
                    x: size.x * i,
                    y: size.y * j,
                },
                anchor: {
                    x: 0.5,
                    y: 0.5,
                },
            });

            count++;
        }
    }

    return ret;
};

export default {
    genAtlasJson,
};
