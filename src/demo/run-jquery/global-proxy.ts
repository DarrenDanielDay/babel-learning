import { isPrimitive, isTSObject } from "../../utils";

export interface BasePropertyAccess {
  type: "get" | "set";
  key: string | number | symbol;
  target: unknown;
}

export interface ReadProperty extends BasePropertyAccess {
  type: "get";
}

export interface SetProperty extends BasePropertyAccess {
  type: "set";
  value: unknown;
}

export type PropertyAccess = ReadProperty | SetProperty;

export class AccessManager<T extends object> implements ProxyHandler<T> {
  public readonly accesses: PropertyAccess[] = [];
  public objectToProxy: Map<object, object> = new Map();
  public proxyToObject: Map<object, object> = new Map();
  get = (target: T, key: PropertyKey, reciever: T) => {
    this.accesses.push({
      type: "get",
      key,
      target: this.proxyToObject.get(target) || target,
    });
    return this.wrapIfNessacerray(Reflect.get(target, key, reciever));
  };
  set = (target: T, key: PropertyKey, value: unknown, reciever: T) => {
    value = this.wrapIfNessacerray(value);
    this.accesses.push({ type: "set", key, value, target });
    return Reflect.set(target, key, value, reciever);
  };
  wrapIfNessacerray = (obj: unknown) => {
    if (!isTSObject(obj)) {
      return obj;
    }
    if (this.objectToProxy.has(obj)) {
      return this.objectToProxy.get(obj);
    }
    const proxy = new Proxy(obj, {
      get: this.get,
      set: this.set,
    });
    this.objectToProxy.set(obj, proxy);
    this.proxyToObject.set(proxy, obj);
    return proxy;
  };
}
export const accessManager = new AccessManager();

export const globalProxy = accessManager.wrapIfNessacerray(global);
