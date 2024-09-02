function calculatePrimesMulticore(limit = 10 ** 5) {
    const numOfCores = navigator.hardwareConcurrency
    let primes = [];

    console.time("Multicore calculation took: ")
    const start = Date.now()
    let end;
    let promise;

    for (let i = 0; i < numOfCores; i++) {
        const sliceSize = Math.floor(limit / numOfCores);
        const worker = new Worker('./myworker.js');

        worker.postMessage({
            from: sliceSize * i,
            to: sliceSize * (i + 1),
            isLastWorker: i == numOfCores - 1
        })

        promise = new Promise(resolve => {
            worker.onmessage = (event) => {
                primes = primes.concat(event.data.primes)

                if (event.data.isLastWorker) {
                    // console.log(primes);
                    // console.timeEnd("Multicore calculation took: ")
                    end = Date.now()
                    resolve({ start, end, primes })
                }
            };
        })
    }

    return promise
}

function calculatePrimesSinglecore(limit = 10 ** 5) {
    const primes = [];

    console.time("Singlecore calculation took: ")
    const start = Date.now()
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
    // console.timeEnd("Singlecore calculation took: ")
    const end = Date.now()

    // console.log(primes);
    return { start, end, primes }
}

function displayLast10FoundedPrimes(primes) {
    const text = `Last 10 founded primes: <code>[...${primes.slice(primes.length - 10, primes.length)}]</code>`
    document.querySelector('.primes').innerHTML = text;
}

document.querySelector('.launch-multicore').addEventListener("click", () => {
    const limit = +document.querySelector('.limit').value;
    calculatePrimesMulticore(limit).then(result => {
        const timeTook = result.end - result.start
        const primes = result.primes
        document.querySelector('.multicore-result').innerHTML = `Multicore calculated in ${timeTook}ms`;
        displayLast10FoundedPrimes(primes)
    })
});

document.querySelector('.launch-singlecore').addEventListener("click", () => {
    const limit = +document.querySelector('.limit').value;
    const result = calculatePrimesSinglecore(limit)
    const timeTook = result.end - result.start
    const primes = result.primes
    document.querySelector('.singlecore-result').innerHTML = `Singlecore calculated in ${timeTook}ms`;
    displayLast10FoundedPrimes(primes)
});