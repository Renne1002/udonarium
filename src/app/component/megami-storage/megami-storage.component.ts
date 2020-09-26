import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { FileArchiver } from '@udonarium/core/file-storage/file-archiver';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { EventSystem, Network } from '@udonarium/core/system';
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { Card } from '@udonarium/card';

import { PanelService } from 'service/panel.service';

interface Tarot {
  name: string;
  image: ImageFile;
}

@Component({
  selector: 'megami-storage',
  templateUrl: './megami-storage.component.html',
  styleUrls: ['./megami-storage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MegamiStorageComponent implements OnInit, OnDestroy, AfterViewInit {

  fileStorageService = ImageStorage.instance;
  talotImages: Tarot[] = [];
  tarotBack: ImageFile;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private panelService: PanelService
  ) {
    this.setupTarot();
  }

  ngOnInit() {
    Promise.resolve().then(() => this.panelService.title = 'メガミリスト');
  }

  ngAfterViewInit() {
    EventSystem.register(this).on('SYNCHRONIZE_FILE_LIST', event => {
      if (event.isSendFromSelf) {
        this.changeDetector.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    EventSystem.unregister(this);
  }

  handleFileSelect(event: Event) {
    let files = (<HTMLInputElement>event.target).files;
    if (files.length) FileArchiver.instance.load(files);
  }

  onSelectedFile(file: ImageFile) {
    console.log('onSelectedFile', file);
    EventSystem.call('SELECT_FILE', { fileIdentifier: file.identifier }, Network.peerId);
  }

  createTarot(tarot: Tarot) {
    let card = Card.create(tarot.name, tarot.image.url, this.tarotBack.url, 2);
    card.uplight();
    SoundEffect.play(PresetSound.cardDraw);
  }

  private setupTarot() {
    const tarots = [
      ['ユリナ', 'tarot_01.png'],
      ['ユリナ (A1)', 'tarot_01_a1.png'],
      ['サイネ', 'tarot_02.png'],
      ['サイネ (A1)', 'tarot_02_a1.png'],
      ['サイネ (A2)', 'tarot_02_a2.png'],
      ['ヒミカ', 'tarot_03.png'],
      ['ヒミカ (A1)', 'tarot_03_a1.png'],
      ['トコヨ', 'tarot_04.png'],
      ['トコヨ (A1)', 'tarot_04_a1.png'],
      ['トコヨ (A2)', 'tarot_04_a2.png'],
      ['オボロ', 'tarot_05.png'],
      ['オボロ (A1)', 'tarot_05_a1.png'],
      ['ユキヒ', 'tarot_06.png'],
      ['ユキヒ (A1)', 'tarot_06_a1.png'],
      ['シンラ', 'tarot_07.png'],
      ['シンラ (A1)', 'tarot_07_a1.png'],
      ['ハガネ', 'tarot_08.png'],
      ['ハガネ (A1)', 'tarot_08_a1.png'],
      ['チカゲ', 'tarot_09.png'],
      ['チカゲ (A1)', 'tarot_09_a1.png'],
      ['クルル', 'tarot_10.png'],
      ['クルル (A1)', 'tarot_10_a1.png'],
      ['サリヤ', 'tarot_11.png'],
      ['サリヤ (A1)', 'tarot_11_a1.png'],
      ['ライラ', 'tarot_12.png'],
      ['ライラ (A1)', 'tarot_12_a1.png'],
      ['ウツロ', 'tarot_13.png'],
      ['ウツロ (A1)', 'tarot_13_a1.png'],
      ['ホノカ', 'tarot_14.png'],
      ['ホノカ (A1)', 'tarot_14_a1.png'],
      ['コルヌ', 'tarot_15.png'],
      ['ヤツハ', 'tarot_16.png'],
      ['ハツミ', 'tarot_17.png'],
      ['ミズキ', 'tarot_18.png'],
      ['メグミ', 'tarot_19.png'],
      ['カナエ', 'tarot_20.png']
    ].forEach(([name, filename]) => {
      const path = `./assets/furuyoni_commons_na/furuyoni_na/tarots/${filename}`;
      if (!this.fileStorageService.get(path)) {
        this.fileStorageService.add(path);
      }
      const image = this.fileStorageService.get(path);
      this.talotImages.push({ name, image })
    })

    const tarotBack = './assets/furuyoni_commons_na/furuyoni_na/tarots/tarotback.png';
    if (!this.fileStorageService.get(tarotBack)) {
      this.fileStorageService.add(tarotBack);
      this.tarotBack = this.fileStorageService.get(tarotBack);
    }
  }
}
