function calculatePrimesMulticore(limit = 10 ** 5) {
    const numOfCores = navigator.hardwareConcurrency
    let results = [];

    console.time("Multicore calculation took: ")

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
            }
        };
    }
}

function calculatePrimes(limit = 10 ** 5) {
    const primes = [];

    console.time("Singlecore calculation took: ")
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

    console.log(primes);
}

calculatePrimes(10 ** 6)
calculatePrimesMulticore(10 ** 6)