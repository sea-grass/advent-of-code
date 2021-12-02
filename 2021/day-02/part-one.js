// Run this in your browser console on the adventofcode.com site.
fetch("https://adventofcode.com/2021/day/2/input").then(res=>res.text())
    .then(text => text.split("\n"))
    .then(x => { console.log(x); return x; })
    .then(lines => lines.map(line => new RegExp(/(.+)\s(.+)/).exec(line)))
    .then(arrs => arrs.filter(x=>!!x))
    .then(arrs => arrs.map(arr => ({dir:arr[1], speed: Number.parseInt(arr[2])})))
    .then(x => { console.log(x); return x})
    .then(movements => movements.reduce((acc, {dir,speed}) => {
        if (dir === 'forward') return {...acc, hor: acc.hor + speed};
        if (dir === 'down') return {...acc, dep: acc.dep + speed};
        if (dir === 'up') return {...acc, dep: acc.dep - speed};
        return acc;
    }, {hor: 0, dep:0}))
    .then(x => { console.log(x); return x; })
    .then(({hor,dep}) => hor*dep)
    .then(console.log);
    