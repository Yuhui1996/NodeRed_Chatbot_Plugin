class Queue {
    static queue = [];
    static pendingPromise  = false;

    static addToQueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.processPromise();
        });
    }

    //not that space efficient
    static processPromise() {
        console.log(this.queue);

        //check if locked
        if (this.mutex_locked) {
            //stop instance if another locked the mutex
            return false;
        }
        //get next item in the queue
        const item = this.queue.shift();
        if (!item) {
            return false;
        }

        //try and run the promise
        try {
            this.mutex_locked = true; //lock mutex
            item.promise()
                .then((value) => {
                    this.mutex_locked = false;
                    item.resolve(value);
                    this.processPromise(); //repeat to try any promise that was locked out before.
                })
                .catch(err => {
                    this.mutex_locked = false;
                    item.reject(err);
                    this.processPromise();
                })
        } catch (err) {
            this.mutex_locked = false;
            item.reject(err);
            this.processPromise();
        }
        return true;
    }
}
module.exports = Queue;