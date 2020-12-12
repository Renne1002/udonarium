import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  HostListener
} from '@angular/core';

import { FileArchiver } from '@udonarium/core/file-storage/file-archiver';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { EventSystem, Network } from '@udonarium/core/system';

import { FuruyoniMegami } from '../../furuyoni/furuyoni-megami';

import { PanelService } from 'service/panel.service';
import { ContextMenuService } from 'service/context-menu.service';
import { PointerDeviceService } from 'service/pointer-device.service';

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
  furuyoniMegami = FuruyoniMegami;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private panelService: PanelService,
    private contextMenuService: ContextMenuService,
    private pointerDeviceService: PointerDeviceService
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

  showTarotContextMenu(megami: FuruyoniMegami, e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;

    let position = this.pointerDeviceService.pointers[0];
    let menu = [
      { name: 'タロットを作成', action: megami.createTarot },
      ...megami.menuActions
    ];
    this.contextMenuService.open(position, menu, megami.name);
  }

  private setupTarot() {
    FuruyoniMegami.all.forEach(megami => {
      megami.loadTarotImage();
    })
  }
}
