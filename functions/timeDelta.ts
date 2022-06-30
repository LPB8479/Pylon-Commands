const timeValues = [
    ['year', 31556952],
    ['month', 2629746],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1]
];

export function timeDelta(unix: number) {
    var nowSecs = Date.now()
    var delta = (nowSecs - unix)/10000
    const texts = [];

    timeValues.forEach(([name, factor]) => {
        const value = Math.floor(delta / factor);

        if (value !== 0) {
            texts.push(`${value} ${name}${value !== 1 ? 's' : ''}`);
            delta -= value * factor;
        }
    });

    return joinCommaAnd(texts);
}
function joinCommaAnd(array) {
    var newArray = [array[0], array[1], array[2]];
    if (array.length > 2) {
        return `${newArray
            .slice(0, newArray.length - 1)
            .toString()
            .replace(/,/gm, ', ')} and ${newArray[newArray.length - 1]}`;
    } else {
        return array.join(' and ').replaceAll(',', ', ');
    }
}