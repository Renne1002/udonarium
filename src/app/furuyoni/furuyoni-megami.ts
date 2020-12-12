import { FURUYONI_MEGAMI_DATA } from './furuyoni-megami-data';
import { ImageStorage } from '../class/core/file-storage/image-storage';
import { Card } from '../class/card';

const TAROT_BACK = './assets/furuyoni_commons_na/furuyoni_na/tarots/tarotback.png';

export class FuruyoniMegami {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly symbol: string,
    readonly tarot: string,
    readonly components?: string[]
  ) {}

  static _all: FuruyoniMegami[];
  static get all(): FuruyoniMegami[] {
    if (this._all) return this._all

    return this._all = FURUYONI_MEGAMI_DATA.map(data => {
      return new FuruyoniMegami(
        data.id,
        data.name,
        data.symbol,
        data.tarot,
        data.components
      );
    });
  }

  static find(id: string): FuruyoniMegami {
    return this.all.find(component => component.id == id);
  }

  static createTarot(id: string): Card {
    const megami = this.find(id);
    megami.loadTarotImage();
    return Card.create(megami.name, megami.tarot, TAROT_BACK, 2);
  }

  loadTarotImage() {
    if (!ImageStorage.instance.get(this.tarot)) {
      ImageStorage.instance.add(this.tarot);
    }
    if (!ImageStorage.instance.get(TAROT_BACK)) {
      ImageStorage.instance.add(TAROT_BACK);
    }
  }
}
