class FoodDeliveryTask {
  start() {
    return new Promise(r => setTimeout(r, 1000));
  }
  getCompletionResultSupplier() {
    return () => ({ time: new Date(), message: this.#getCompletionMessage() });
  }
  #getCompletionMessage() {
    return "Done delivering food";
  }
}

class KitchenCleanTask {
  start() {
    return new Promise(r => setTimeout(r, 1000));
  }
  getCompletionResultSupplier() {
    return () => ({ time: new Date(), message: this.#getCompletionMessage() });
  }
  #getCompletionMessage() {
    return "Done cleaning kitchen";
  }
}

class TaskQueue {
  #tasks = [];
  #current = undefined;
  #acceptNewTasks = true;
  #resolveWaitUntilDone = undefined;
  #results = [];

  submit(task) {
    if (!this.#acceptNewTasks) {
      throw new Error("This queue does not accept new tasks anymore");
    }
    this.#tasks.push(task);
    this.#processQueue();
  }

  #processQueue() {
    if (this.#current) {
      return;
    }
    if (this.#tasks.length > 0) {
      const nextTask = this.#tasks.shift();
      this.#current = {
        promise: nextTask.start(),
        getResult: nextTask.getCompletionResultSupplier(),
      };
      this.#current.promise
        .finally(() => this.#results.push(this.#current.getResult()))
        .finally(() => (this.#current = undefined))
        .finally(() => this.#processQueue());
    } else {
      if (this.#resolveWaitUntilDone) {
        this.#resolveWaitUntilDone(this.#results);
      }
    }
  }
  waitUntilDone() {
    this.#acceptNewTasks = false;
    if (this.#tasks.length === 0 && this.#current === undefined) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.#resolveWaitUntilDone = resolve;
    });
  }
}

console.log("This will take 2 seconds");

const taskQueue = new TaskQueue();
taskQueue.submit(new FoodDeliveryTask());
taskQueue.submit(new KitchenCleanTask());
taskQueue.waitUntilDone();