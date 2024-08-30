function calculatePrimesMulticore(limit = 10 ** 6) {
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

calculatePrimesMulticore(10 ** 5)