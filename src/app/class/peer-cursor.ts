import { GameTableComponent } from 'component/game-table/game-table.component';
import { LocalStorageService } from 'service/local-storage.service';
import { ImageFile } from './core/file-storage/image-file';
import { ImageStorage } from './core/file-storage/image-storage';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { GameObject, ObjectContext } from './core/synchronize-object/game-object';
import { ObjectStore } from './core/synchronize-object/object-store';
import { EventSystem, Network } from './core/system';

interface UserSetting {
  peerName: string;
  fixRotateX: boolean;
  fixRotateY: boolean;
  fixRotateZ: boolean;
  fixPositionX: boolean;
  fixPositionY: boolean;
  fixPositionZ: boolean;
  cardPreviewHeight: number;
}

@SyncObject('PeerCursor')
export class PeerCursor extends GameObject {
  @SyncVar() peerId: string = '';
  @SyncVar() color: string = '#EF5350';
  @SyncVar() name: string = '';
  @SyncVar() imageIdentifier: string = '';

  static myCursor: PeerCursor = null;
  private static hash: { [peerId: string]: string } = {};

  get isMine(): boolean { return (PeerCursor.myCursor && PeerCursor.myCursor === this); }
  get image(): ImageFile { return ImageStorage.instance.get(this.imageIdentifier); }
  table: GameTableComponent;

  private _userSetting: UserSetting;
  get userSetting(): UserSetting {
    if (!this._userSetting) {
      const storageSetting = LocalStorageService.instance.fetch()['user-setting'];
      this._userSetting = Object.assign({
        fixRotateX: false,
        fixRotateY: false,
        fixRotateZ: false,
        fixPositionX: false,
        fixPositionY: false,
        fixPositionZ: false,
        cardPreviewHeight: 330,
      }, storageSetting);
    }
    return this._userSetting;
  }
  updateUserSetting(key: string, value: any) {
    const setting = this.userSetting;
    setting[key] = value;
    this._userSetting = setting;
    LocalStorageService.instance.add({ key: 'user-setting', val: this._userSetting });
  }

  // GameObject Lifecycle
  onStoreAdded() {
    super.onStoreAdded();
    if (!this.isMine) {
      EventSystem.register(this)
        .on('DISCONNECT_PEER', -1000, event => {
          if (event.data.peer !== this.peerId) return;
          delete PeerCursor.hash[this.peerId];
          ObjectStore.instance.remove(this);
        });
    }
  }

  // GameObject Lifecycle
  onStoreRemoved() {
    super.onStoreRemoved();
    EventSystem.unregister(this);
    delete PeerCursor.hash[this.peerId];
  }

  static find(peerId): PeerCursor {
    let identifier = PeerCursor.hash[peerId];
    if (identifier != null && ObjectStore.instance.get(identifier)) return ObjectStore.instance.get<PeerCursor>(identifier);
    let cursors = ObjectStore.instance.getObjects<PeerCursor>(PeerCursor);
    for (let cursor of cursors) {
      if (cursor.peerId === peerId) {
        PeerCursor.hash[peerId] = cursor.identifier;
        return cursor;
      }
    }
    return null;
  }

  static createMyCursor(): PeerCursor {
    if (PeerCursor.myCursor) {
      console.warn('It is already created.');
      return PeerCursor.myCursor;
    }
    PeerCursor.myCursor = new PeerCursor();
    PeerCursor.myCursor.peerId = Network.peerId;
    PeerCursor.myCursor.initialize();
    return PeerCursor.myCursor;
  }

  // override
  apply(context: ObjectContext) {
    if (context.syncData['peerId'] !== this.peerId) {
      PeerCursor.hash[context.syncData['peerId']] = PeerCursor.hash[this.peerId];
      delete PeerCursor.hash[this.peerId];
    }
    super.apply(context);
  }

  isPeerAUdon() {
    return /u.*d.*o.*n/ig.exec(this.peerId) != null;
  }
}
