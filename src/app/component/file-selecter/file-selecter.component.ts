import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ImageFile } from '@udonarium/core/file-storage/image-file';
import { ImageStorage } from '@udonarium/core/file-storage/image-storage';
import { EventSystem, Network } from '@udonarium/core/system';
import { ModalService } from 'service/modal.service';
import { PanelService } from 'service/panel.service';

@Component({
  selector: 'file-selector',
  templateUrl: './file-selecter.component.html',
  styleUrls: ['./file-selecter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileSelecterComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() isAllowedEmpty: boolean = false;
  @Input() isAllowedUri: boolean = false;
  get images(): ImageFile[] { return ImageStorage.instance.images; }
  get empty(): ImageFile { return ImageFile.Empty; }

  inputUriValue = null;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private panelService: PanelService,
    private modalService: ModalService
  ) {
    this.isAllowedEmpty = this.modalService.option && this.modalService.option.isAllowedEmpty ? true : false;
    this.isAllowedUri = this.modalService.option && this.modalService.option.isAllowedUri ? true : false;
  }

  ngOnInit() {
    Promise.resolve().then(() => this.modalService.title = this.panelService.title = 'ファイル一覧');
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

  onSelectedFile(file: ImageFile) {
    console.log('onSelectedFile', file);
    EventSystem.call('SELECT_FILE', { fileIdentifier: file.identifier }, Network.peerId);
    this.modalService.resolve(file.identifier);
  }

  onSelectedUri() {
    if (!ImageStorage.instance.get(this.inputUriValue)) {
      ImageStorage.instance.add(this.inputUriValue);
    }
    const imageFile = ImageStorage.instance.get(this.inputUriValue);
    EventSystem.call('SELECT_FILE', { fileIdentifier: imageFile.identifier }, Network.peerId);
    this.modalService.resolve({ identifier: imageFile.identifier, uri: true });
  }
}
