/**
 * @class Queue
 * @classdesc This is a class that organises promises into a queue manually. This allows each calls to the IBM API to be
 * synchronous which prevents a deadlock at the backend. Class is static for synchronous purposes.
 */
class Queue {
    static queue = [];
    static pendingPromise  = false;

    /**
     * @memberOf Queue
     * @function add to Queue
     * @description Add a promise to the Queue so that is can then be processed.
     * Then call the queueing function so that promises can be executed.
     * @param {Promise<AssistantV1.Response<AssistantV1.DialogNode>>} promise API call
     * to IBM
     * @return {Promise<executor>} Promise to be added to the queue and thus executes
     * when promise is complete
     */
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

    /**
     * @function Process Promise
     * @memberOf  Queue
     * @description Using a mutex, recursively
     * @returns {boolean} has finished parsing queue or if another instance of the
     * function has locked the mutex.
     *
     * @var {boolean } mutex lock so that only one instance of the recursive function
     * can run at once
     */
    static processPromise() {
        // console.log(this.queue);

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