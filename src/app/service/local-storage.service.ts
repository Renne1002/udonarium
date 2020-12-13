import { Injectable } from '@angular/core';

const STORAGTE_KEY = 'furuyoni-udonarium';

interface StorageItem {
  key: string;
  val: any;
}

@Injectable()
export class LocalStorageService {
  private static _instance: LocalStorageService;
  static get instance(): LocalStorageService {
    if (!LocalStorageService._instance) {
      LocalStorageService._instance = new LocalStorageService();
    }
    return LocalStorageService._instance;
  }

  fetch() {
    return JSON.parse(localStorage.getItem(STORAGTE_KEY)) || {};
  }

  add(item: StorageItem): void {
    const items = this.fetch();
    items[item.key] = item.val;
    localStorage.setItem(STORAGTE_KEY, JSON.stringify(items));
  }

  remove(key: string) {
    const items = this.fetch();
    const retVal = items[key];
    delete items[key];
    localStorage.setItem(STORAGTE_KEY, JSON.stringify(items));
    return retVal;
  }

  clear(): void {
    localStorage.removeItem(STORAGTE_KEY);
  }
}
