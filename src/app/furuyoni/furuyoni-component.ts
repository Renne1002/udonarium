import { FURUYONI_COMPONENT_DATA } from './furuyoni-component-data';
import { ImageStorage } from '../class/core/file-storage/image-storage';
import { Card } from '../class/card';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';

export class FuruyoniComponent {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly front: string,
    readonly back: string,
    readonly size: number,
    readonly forceBack: boolean,
    readonly tags?: string[]
  ) {}

  static _all: FuruyoniComponent[];
  static get all(): FuruyoniComponent[] {
    if (this._all) return this._all

    return this._all = FURUYONI_COMPONENT_DATA.map(data => {
      return new FuruyoniComponent(
        data.id,
        data.name,
        data.front,
        data.back,
        data.size,
        data.forceBack,
        data.tags,
      );
    });
  }

  static find(id: string): FuruyoniComponent {
    return this.all.find(component => component.id == id);
  }

  static create(component: string | FuruyoniComponent): Card {
    if (typeof component == 'string') component = this.find(component);
    component.loadImage();
    let card = Card.create(component.name, component.front, component.back, component.size);
    if (component.forceBack) card.forceBack = true;
    if (component.tags) {
      card.setTag(...component.tags);
    }
    SoundEffect.play(PresetSound.piecePut);
    return card;
  }

  create(): Card {
    return FuruyoniComponent.create(this);
  }

  loadImage() {
    if (!ImageStorage.instance.get(this.front)) {
      ImageStorage.instance.add(this.front);
    }
    if (!ImageStorage.instance.get(this.back)) {
      ImageStorage.instance.add(this.back);
    }
  }
}
