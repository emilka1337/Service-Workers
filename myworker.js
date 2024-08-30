self.onmessage = (event) => {
    const data = event.data;
    const primes = [];

    for (let i = data.from; i < data.to; i++) {
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

    self.postMessage({primes, isLastWorker: event.data.isLastWorker});
};