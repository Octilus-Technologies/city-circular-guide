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

export const isSameArray = <T>(arr1: Array<T>, arr2: Array<T>) => {
    if (arr1.length !== arr2.length) return false;

    return arr1.every((val, index) => val === arr2[index]);
};

/**
 * Filters `null` and `undefined` from runtime and type level
 */
export const filterNullValues = <T>(arr: Array<T | null | undefined>) => {
    return arr.filter((v): v is T => v !== null && v !== undefined);
};
