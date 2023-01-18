export const findMode = <T>(originalArray: Array<T>) => {
    const arr = [...originalArray];

    const sortedArray = arr.sort(
        (a, b) =>
            arr.filter((v) => v === a).length -
            arr.filter((v) => v === b).length
    );
    console.log({ sortedArray });
    return sortedArray.pop();
};

export const rotateArray = <T>(arr: Array<T>, times: number) => {
    const tmpArr = [...arr]; // clone array to avoid mutation of original array
    for (let i = 0; i < times; i++) {
        const tmp = tmpArr.shift();
        if (tmp) tmpArr.push(tmp);
    }

    return tmpArr;
};
