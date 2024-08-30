function calculatePrimesMulticore(limit = 10 ** 5) {
    const numOfCores = navigator.hardwareConcurrency
    let results = [];

    console.time("Multicore calculation took: ")
    let start = Date.now()
    let end;

    for (let i = 0; i < numOfCores; i++) {
        let sliceSize = Math.floor(limit / numOfCores);
        const worker = new Worker('./myworker.js');

        worker.postMessage({
            from: sliceSize * i,
            to: sliceSize * (i + 1),
            isLastWorker: i == numOfCores - 1
        })

        worker.onmessage = (event) => {
            results = results.concat(event.data.primes)

            if (event.data.isLastWorker) {
                console.log(results);
                console.timeEnd("Multicore calculation took: ")
                end = Date.now()
            }
        };
    }
    
    return end - start
}

function calculatePrimesSinglecore(limit = 10 ** 5) {
    const primes = [];

    console.time("Singlecore calculation took: ")
    let start = Date.now()
    for (let i = 0; i < limit; i++) {
        let isPrime = true;
        
        for (let j = 2; j < i; j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            primes.push(i);
            
        }
    }
    console.timeEnd("Singlecore calculation took: ")
    let end = Date.now()

    console.log(primes);
    return end - start
}

document.querySelector('.launch-multicore').addEventListener("click", () => {
    let limit = +document.querySelector('.limit').value;
    let timeTook = calculatePrimesMulticore(limit)
    document.querySelector('.multicore-result').innerHTML = `Multicore calculated in ${timeTook}ms`;
});

document.querySelector('.launch-singlecore').addEventListener("click", () => {
    let limit = +document.querySelector('.limit').value;
    let timeTook = calculatePrimesSinglecore(limit)
    document.querySelector('.singlecore-result').innerHTML = `Singlecore calculated in ${timeTook}ms`;
});