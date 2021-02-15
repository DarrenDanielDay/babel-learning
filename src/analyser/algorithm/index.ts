export function* dfs<T, R>(
  root: T,
  nexts: (node: T) => Iterable<T>,
  onNode: (node: T) => R
): Generator<R, void, unknown> {
  yield onNode.call(undefined, root);
  for (const node of nexts(root)) {
    yield* dfs(node, nexts, onNode);
  }
}

export async function* dfsAsync<T, R>(
  root: T,
  nexts: (node: T) => Promise<Iterable<T>>,
  onNode: (node: T) => Promise<R>
): AsyncGenerator<R, void, unknown> {
  yield onNode.call(undefined, root);
  for (const node of await nexts(root)) {
    for await (const result of dfsAsync(node, nexts, onNode)) {
      yield result;
    }
  }
}

interface LinkedNode<T> {
  value: T;
  next?: LinkedNode<T>;
}

export class Queue<T> {
  head?: LinkedNode<T>;
  tail?: LinkedNode<T>;
  constructor() {}

  empty() {
    return this.head === undefined;
  }

  append(value: T) {
    if (this.empty()) {
      this.head = this.tail = { value };
      return;
    }
    if (this.tail) {
      this.tail.next = { value };
      this.tail = this.tail.next;
      return;
    }
    throw new Error("Queue detected in invalid state.");
  }

  serve(): T {
    if (this.empty()) {
      throw new Error("Cannot serve with empty queue.");
    }
    const result = this.head!.value;
    this.head = this.head!.next;
    return result;
  }
}

export function* bfs<T, R>(
  root: T,
  nexts: (node: T) => T[],
  onNode: (node: T) => R
): Generator<R, void, unknown> {
  const queue = new Queue<T>();
  queue.append(root);
  while (!queue.empty()) {
    const node = queue.serve();
    yield onNode(node);
    nexts(node).forEach((next) => queue.append(next));
  }
}
