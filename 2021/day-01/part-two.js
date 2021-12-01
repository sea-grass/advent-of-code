// Run this in your browser console on the adventofcode.com site.
fetch('https://adventofcode.com/2021/day/1/input')
    .then(res=> res.text())
    .then(text => text.split('\n'))
    .then(data => { console.log(data); return data; })
    .then(lines => lines.map(x => Number.parseInt(x)))
    .then(nums => nums.map((num, i, arr) => i >= arr - 3 ? 0 : arr[i] + arr[i+1] + arr[i+2]))
    .then(nums => nums.reduce((acc, curr, i, arr) => i === 0  ? acc : curr > arr[i-1] ? acc + 1 : acc, 0))
    .then(console.log)