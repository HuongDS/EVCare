type Task<T> = () => Promise<T>;

class RequestQueue {
  private concurrency: number;
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(concurrency: number) {
    this.concurrency = concurrency;
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const runTask = () => {
        this.running++;
        task()
          .then(resolve)
          .catch(reject)
          .finally(() => {
            this.running--;
            if (this.queue.length > 0) {
              const next = this.queue.shift()!;
              next();
            }
          });
      };

      if (this.running < this.concurrency) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }
}

export const requestQueue = new RequestQueue(3);
