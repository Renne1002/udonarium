import { ImageFile } from './core/file-storage/image-file';
import { SyncObject, SyncVar } from './core/synchronize-object/decorator';
import { Network } from './core/system';
import { DataElement } from './data-element';
import { PeerCursor } from './peer-cursor';
import { TabletopObject } from './tabletop-object';
import { moveToTopmost } from './tabletop-object-util';

export enum CardState {
  FRONT,
  BACK,
}

@SyncObject('card')
export class Card extends TabletopObject {
  @SyncVar() state: CardState = CardState.FRONT;
  @SyncVar() rotate: number = 0;
  @SyncVar() owner: string = '';
  @SyncVar() holder: string = '';
  @SyncVar() zindex: number = 0;

  menu = [];

  get name(): string { return this.getCommonValue('name', ''); }
  get size(): number { return this.getCommonValue('size', 2); }
  set size(size: number) { this.setCommonValue('size', size); }
  get frontImage(): ImageFile { return this.getImageFile('front'); }
  get backImage(): ImageFile { return this.getImageFile('back'); }

  get imageFile(): ImageFile { return this.isVisible ? this.frontImage : this.backImage; }

  get ownerName(): string {
    let object = PeerCursor.find(this.owner);
    return object ? object.name : '';
  }
  get holderName(): string {
    let object = PeerCursor.find(this.holder);
    return object ? object.name : '';
  }
  get holderColor(): string {
    let object = PeerCursor.find(this.holder);
    return object ? object.color : '';
  }

  get hasOwner(): boolean { return PeerCursor.find(this.owner) != null; }
  get hasHolder(): boolean { return PeerCursor.find(this.holder) != null; }
  get isHand(): boolean { return Network.peerId === this.owner; }
  get isFront(): boolean { return this.state === CardState.FRONT; }
  get isVisible(): boolean { return this.isHand || this.isFront; }

  faceUp() {
    this.state = CardState.FRONT;
    this.owner = '';
  }

  faceDown() {
    this.state = CardState.BACK;
    this.owner = '';
  }

  upright() {
    const el: HTMLElement = document.querySelector('game-table > .component > .component-content');
    const transform = el.style.transform;
    const matches = transform.match(/rotateZ\((-?\d+)/);
    let rotate = 0;
    if (matches) {
      const rotateZ = (Number(matches[1]) % 360 + 360) % 360;
      if (90 < rotateZ && rotateZ <= 270) {
        rotate = 180;
      }
    }
    this.rotate = rotate;
  }

  toTopmost() {
    moveToTopmost(this, ['card-stack']);
  }

  static create(name: string, fornt: string, back: string, size: number = 2, identifier?: string): Card {
    let object: Card = null;

    if (identifier) {
      object = new Card(identifier);
    } else {
      object = new Card();
    }
    object.createDataElements();

    object.commonDataElement.appendChild(DataElement.create('name', name, {}, 'name_' + object.identifier));
    object.commonDataElement.appendChild(DataElement.create('size', size, {}, 'size_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('front', fornt, { type: 'image' }, 'front_' + object.identifier));
    object.imageDataElement.appendChild(DataElement.create('back', back, { type: 'image' }, 'back_' + object.identifier));
    object.initialize();

    return object;
  }
}
