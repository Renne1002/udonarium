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
import { PresetSound, SoundEffect } from '@udonarium/sound-effect';
import { CardStack } from '@udonarium/card-stack';
import { ContextMenuSeparator, ContextMenuService } from 'service/context-menu.service';
import { PointerCoordinate, PointerDeviceService } from 'service/pointer-device.service';
import { Card, CardState } from '@udonarium/card';

import { PanelService } from 'service/panel.service';

const MEGAMI_TAROTS = [
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
];

const MEGAMI_CARDS = {
  'ユリナ': [
    'na_01_yurina_o_n_1.png',
    'na_01_yurina_o_n_2.png',
    'na_01_yurina_o_n_3.png',
    // 'na_01_yurina_o_n_4.png',
    'na_01_yurina_o_n_4_s2.png',
    'na_01_yurina_o_n_5.png',
    // 'na_01_yurina_o_n_5_s2.png',
    // 'na_01_yurina_o_n_5_s5.png',
    'na_01_yurina_o_n_6.png',
    'na_01_yurina_o_n_7.png',
    'na_01_yurina_o_s_1.png',
    // 'na_01_yurina_o_s_2.png',
    'na_01_yurina_o_s_2_s5.png',
    // 'na_01_yurina_o_s_3.png',
    'na_01_yurina_o_s_3_s2.png',
    'na_01_yurina_o_s_4.png',
  ],
  'ユリナ (A1)': [
    'na_01_yurina_a1_n_1.png',
    // 'na_01_yurina_a1_s_2.png',
    'na_01_yurina_o_n_2.png',
    'na_01_yurina_o_n_3.png',
    // 'na_01_yurina_o_n_4.png',
    'na_01_yurina_o_n_4_s2.png',
    'na_01_yurina_o_n_5.png',
    // 'na_01_yurina_o_n_5_s2.png',
    // 'na_01_yurina_o_n_5_s5.png',
    'na_01_yurina_a1_n_6.png',
    'na_01_yurina_o_n_7.png',
    'na_01_yurina_o_s_1.png',
    'na_01_yurina_a1_s_2_s5.png',
    // 'na_01_yurina_o_s_3.png',
    'na_01_yurina_o_s_3_s2.png',
    'na_01_yurina_o_s_4.png',
  ],
  'サイネ': [
    'na_02_saine_o_n_1.png',
    'na_02_saine_o_n_2.png',
    // 'na_02_saine_o_n_3.png',
    'na_02_saine_o_n_3_s3.png',
    'na_02_saine_o_n_4.png',
    // 'na_02_saine_o_n_5.png',
    'na_02_saine_o_n_5_s5.png',
    // 'na_02_saine_o_n_6.png',
    'na_02_saine_o_n_6_s3.png',
    'na_02_saine_o_n_7.png',
    // 'na_02_saine_o_s_1.png',
    'na_02_saine_o_s_1_s2.png',
    // 'na_02_saine_o_s_2.png',
    'na_02_saine_o_s_2_s2.png',
    // 'na_02_saine_o_s_3.png',
    'na_02_saine_o_s_3_s2.png',
    // 'na_02_saine_o_s_4.png',
    'na_02_saine_o_s_4_s2.png',
  ],
  'サイネ (A1)': [
    'na_02_saine_o_n_1.png',
    'na_02_saine_o_n_2.png',
    'na_02_saine_a1_n_3.png',
    'na_02_saine_o_n_4.png',
    // 'na_02_saine_o_n_5.png',
    'na_02_saine_o_n_5_s5.png',
    'na_02_saine_a1_n_6.png',
    'na_02_saine_o_n_7.png',
    // 'na_02_saine_o_s_1.png',
    'na_02_saine_o_s_1_s2.png',
    'na_02_saine_a1_s_2.png',
    // 'na_02_saine_o_s_3.png',
    'na_02_saine_o_s_3_s2.png',
    // 'na_02_saine_o_s_4.png',
    'na_02_saine_o_s_4_s2.png',
  ],
  'サイネ (A2)': [
    'na_02_saine_o_n_1.png',
    'na_02_saine_a2_n_2.png',
    // 'na_02_saine_o_n_3.png',
    'na_02_saine_o_n_3_s3.png',
    'na_02_saine_o_n_4.png',
    // 'na_02_saine_o_n_5.png',
    'na_02_saine_o_n_5_s5.png',
    // 'na_02_saine_o_n_6.png',
    'na_02_saine_o_n_6_s3.png',
    'na_02_saine_a2_n_7.png',
    // 'na_02_saine_o_s_1.png',
    'na_02_saine_o_s_1_s2.png',
    // 'na_02_saine_o_s_2.png',
    'na_02_saine_o_s_2_s2.png',
    'na_02_saine_a2_s_3.png',
    // 'na_02_saine_o_s_4.png',
    'na_02_saine_o_s_4_s2.png',
  ],
  'ヒミカ': [
    'na_03_himika_o_n_1.png',
    // 'na_03_himika_o_n_2.png',
    'na_03_himika_o_n_2_s4.png',
    'na_03_himika_o_n_3.png',
    'na_03_himika_o_n_4.png',
    'na_03_himika_o_n_5.png',
    // 'na_03_himika_o_n_6.png',
    'na_03_himika_o_n_6_s5.png',
    'na_03_himika_o_n_7.png',
    'na_03_himika_o_s_1.png',
    'na_03_himika_o_s_2.png',
    'na_03_himika_o_s_3.png',
    'na_03_himika_o_s_4.png',
  ],
  'ヒミカ (A1)': [
    'na_03_himika_o_n_1.png',
    'na_03_himika_a1_n_2.png',
    'na_03_himika_o_n_3.png',
    'na_03_himika_o_n_4.png',
    'na_03_himika_a1_n_5.png',
    // 'na_03_himika_o_n_6.png',
    'na_03_himika_o_n_6_s5.png',
    'na_03_himika_o_n_7.png',
    'na_03_himika_o_s_1.png',
    'na_03_himika_a1_s_2.png',
    'na_03_himika_o_s_3.png',
    'na_03_himika_o_s_4.png',
  ],
  'トコヨ': [
    // 'na_04_tokoyo_o_n_1.png',
    'na_04_tokoyo_o_n_1_s2.png',
    'na_04_tokoyo_o_n_2.png',
    'na_04_tokoyo_o_n_3.png',
    'na_04_tokoyo_o_n_4.png',
    'na_04_tokoyo_o_n_5.png',
    'na_04_tokoyo_o_n_6.png',
    // 'na_04_tokoyo_o_n_7.png',
    'na_04_tokoyo_o_n_7_s2.png',
    'na_04_tokoyo_o_s_1.png',
    'na_04_tokoyo_o_s_2.png',
    // 'na_04_tokoyo_o_s_3.png',
    'na_04_tokoyo_o_s_3_s2.png',
    'na_04_tokoyo_o_s_4.png',
  ],
  'トコヨ (A1)': [
    // 'na_04_tokoyo_a1_n_1.png',
    // 'na_04_tokoyo_o_n_1.png',
    'na_04_tokoyo_o_n_1_s2.png',
    'na_04_tokoyo_o_n_2.png',
    'na_04_tokoyo_o_n_3.png',
    'na_04_tokoyo_o_n_4.png',
    'na_04_tokoyo_a1_n_5_s3.png',
    'na_04_tokoyo_o_n_6.png',
    'na_04_tokoyo_a1_n_7.png',
    'na_04_tokoyo_o_s_1.png',
    // 'na_04_tokoyo_a1_s_2.png',
    'na_04_tokoyo_a1_s_2_s3.png',
    // 'na_04_tokoyo_o_s_3.png',
    'na_04_tokoyo_o_s_3_s2.png',
    'na_04_tokoyo_o_s_4.png',
  ],
  'トコヨ (A2)': [
    // 'na_04_tokoyo_o_n_1.png',
    'na_04_tokoyo_o_n_1_s2.png',
    'na_04_tokoyo_a2_n_2.png',
    'na_04_tokoyo_o_n_3.png',
    'na_04_tokoyo_o_n_4.png',
    'na_04_tokoyo_o_n_5.png',
    'na_04_tokoyo_o_n_6.png',
    // 'na_04_tokoyo_o_n_7.png',
    'na_04_tokoyo_o_n_7_s2.png',
    'na_04_tokoyo_o_s_1.png',
    'na_04_tokoyo_a2_s_2.png',
    'na_04_tokoyo_a2_s_3.png',
    'na_04_tokoyo_o_s_4.png',
  ],
  'オボロ': [
    'na_05_oboro_o_n_1.png',
    // 'na_05_oboro_o_n_2.png',
    'na_05_oboro_o_n_2_s2.png',
    'na_05_oboro_o_n_3.png',
    // 'na_05_oboro_o_n_4.png',
    'na_05_oboro_o_n_4_s3.png',
    'na_05_oboro_o_n_5.png',
    'na_05_oboro_o_n_6.png',
    'na_05_oboro_o_n_7.png',
    'na_05_oboro_o_s_1.png',
    // 'na_05_oboro_o_s_2.png',
    'na_05_oboro_o_s_2_s3.png',
    'na_05_oboro_o_s_3.png',
    // 'na_05_oboro_o_s_4.png',
    'na_05_oboro_o_s_4_s3.png',
  ],
  'オボロ (A1)': [
    'na_05_oboro_o_n_1.png',
    'na_05_oboro_a1_n_2.png',
    // 'na_05_oboro_o_n_4.png',
    // 'na_05_oboro_a1_n_3.png',
    'na_05_oboro_a1_n_3_s5.png',
    'na_05_oboro_o_n_4_s3.png',
    'na_05_oboro_o_n_5.png',
    'na_05_oboro_o_n_6.png',
    'na_05_oboro_o_n_7.png',
    'na_05_oboro_o_s_1.png',
    // 'na_05_oboro_o_s_2.png',
    'na_05_oboro_o_s_2_s3.png',
    'na_05_oboro_o_s_3.png',
    'na_05_oboro_a1_s_4.png',
    // 'na_05_oboro_a1_s_4_ex1.png',
    'na_05_oboro_a1_s_4_ex1_s5.png',
  ],
  'ユキヒ': [
    'na_06_yukihi_o_n_1.png',
    'na_06_yukihi_o_n_2.png',
    'na_06_yukihi_o_n_3.png',
    'na_06_yukihi_o_n_4.png',
    'na_06_yukihi_o_n_5.png',
    'na_06_yukihi_o_n_6.png',
    'na_06_yukihi_o_n_7.png',
    'na_06_yukihi_o_s_1.png',
    'na_06_yukihi_o_s_2.png',
    'na_06_yukihi_o_s_3.png',
    'na_06_yukihi_o_s_4.png',
    'umbrella_a.png',
  ],
  'ユキヒ (A1)': [
    'na_06_yukihi_o_n_1.png',
    'na_06_yukihi_a1_n_2.png',
    'na_06_yukihi_o_n_3.png',
    'na_06_yukihi_a1_n_4.png',
    'na_06_yukihi_o_n_5.png',
    'na_06_yukihi_o_n_6.png',
    'na_06_yukihi_o_n_7.png',
    'na_06_yukihi_o_s_1.png',
    'na_06_yukihi_a1_s_2.png',
    'na_06_yukihi_o_s_3.png',
    'na_06_yukihi_o_s_4.png',
    'umbrella_a.png',
  ],
  'シンラ': [
    'na_07_shinra_o_n_1.png',
    'na_07_shinra_o_n_2.png',
    'na_07_shinra_o_n_3.png',
    'na_07_shinra_o_n_4.png',
    'na_07_shinra_o_n_5.png',
    // 'na_07_shinra_o_n_6.png',
    'na_07_shinra_o_n_6_s3.png',
    'na_07_shinra_o_n_7.png',
    // 'na_07_shinra_o_s_1.png',
    'na_07_shinra_o_s_1_s6.png',
    // 'na_07_shinra_o_s_2.png',
    'na_07_shinra_o_s_2_s2.png',
    'na_07_shinra_o_s_3.png',
    'na_07_shinra_o_s_4.png',
  ],
  'シンラ (A1)': [
    'na_07_shinra_o_n_1.png',
    'na_07_shinra_a1_n_2.png',
    'na_07_shinra_o_n_3.png',
    'na_07_shinra_o_n_4.png',
    'na_07_shinra_o_n_5.png',
    // 'na_07_shinra_o_n_6.png',
    'na_07_shinra_o_n_6_s3.png',
    'na_07_shinra_a1_n_7.png',
    // 'na_07_shinra_o_s_1.png',
    'na_07_shinra_o_s_1_s6.png',
    // 'na_07_shinra_o_s_2.png',
    'na_07_shinra_o_s_2_s2.png',
    'na_07_shinra_a1_s_3.png',
    'na_07_shinra_o_s_4.png',
  ],
  'ハガネ': [
    // 'na_08_hagane_o_n_1.png',
    'na_08_hagane_o_n_1_s2.png',
    'na_08_hagane_o_n_2.png',
    'na_08_hagane_o_n_3.png',
    'na_08_hagane_o_n_4.png',
    'na_08_hagane_o_n_5.png',
    'na_08_hagane_o_n_6.png',
    'na_08_hagane_o_n_7.png',
    // 'na_08_hagane_o_s_1.png',
    'na_08_hagane_o_s_1_s5.png',
    'na_08_hagane_o_s_2.png',
    'na_08_hagane_o_s_3.png',
    'na_08_hagane_o_s_4.png',
  ],
  'ハガネ (A1)': [
    'na_08_hagane_a1_n_1.png',
    'na_08_hagane_a1_n_2.png',
    'na_08_hagane_o_n_3.png',
    'na_08_hagane_o_n_4.png',
    'na_08_hagane_o_n_5.png',
    'na_08_hagane_o_n_6.png',
    'na_08_hagane_o_n_7.png',
    'na_08_hagane_a1_s_1.png',
    'na_08_hagane_a1_s_1_ex1.png',
    'na_08_hagane_o_s_2.png',
    'na_08_hagane_o_s_3.png',
    'na_08_hagane_o_s_4.png',
  ],
  'チカゲ': [
    'na_09_chikage_o_n_1.png',
    'na_09_chikage_o_n_2.png',
    // 'na_09_chikage_o_n_3.png',
    'na_09_chikage_o_n_3_s5.png',
    'na_09_chikage_o_n_4.png',
    'na_09_chikage_o_n_5.png',
    'na_09_chikage_o_n_6.png',
    'na_09_chikage_o_n_7.png',
    'na_09_chikage_o_p_1.png',
    'na_09_chikage_o_p_2.png',
    'na_09_chikage_o_p_3.png',
    'na_09_chikage_o_p_4.png',
    'na_09_chikage_o_p_4.png',
    'na_09_chikage_o_s_1.png',
    'na_09_chikage_o_s_2.png',
    'na_09_chikage_o_s_3.png',
    'na_09_chikage_o_s_4.png',
  ],
  'チカゲ (A1)': [
    'na_09_chikage_o_n_1.png',
    'na_09_chikage_o_n_2.png',
    // 'na_09_chikage_o_n_3.png',
    'na_09_chikage_o_n_3_s5.png',
    'na_09_chikage_o_n_4.png',
    'na_09_chikage_a1_n_5.png',
    'na_09_chikage_a1_n_6.png',
    'na_09_chikage_o_n_7.png',
    'na_09_chikage_o_p_1.png',
    'na_09_chikage_o_p_2.png',
    'na_09_chikage_o_p_3.png',
    'na_09_chikage_o_p_4.png',
    'na_09_chikage_o_p_4.png',
    'na_09_chikage_o_s_1.png',
    'na_09_chikage_o_s_2.png',
    'na_09_chikage_o_s_3.png',
    'na_09_chikage_a1_s_4.png',
  ],
  'クルル': [
    'na_10_kururu_o_n_1.png',
    'na_10_kururu_o_n_2.png',
    'na_10_kururu_o_n_3.png',
    'na_10_kururu_o_n_4.png',
    'na_10_kururu_o_n_5.png',
    'na_10_kururu_o_n_6.png',
    'na_10_kururu_o_n_7.png',
    'na_10_kururu_o_s_1.png',
    // 'na_10_kururu_o_s_2.png',
    'na_10_kururu_o_s_2_s2.png',
    // 'na_10_kururu_o_s_3.png',
    'na_10_kururu_o_s_3_ex1.png',
    'na_10_kururu_o_s_3_ex1.png',
    'na_10_kururu_o_s_3_ex1.png',
    'na_10_kururu_o_s_3_s5.png',
    'na_10_kururu_o_s_4.png',
  ],
  'クルル (A1)': [
    'na_10_kururu_a1_n_1.png',
    'na_10_kururu_o_n_2.png',
    'na_10_kururu_a1_n_3.png',
    'na_10_kururu_o_n_4.png',
    'na_10_kururu_o_n_5.png',
    'na_10_kururu_o_n_6.png',
    'na_10_kururu_o_n_7.png',
    'na_10_kururu_o_s_1.png',
    // 'na_10_kururu_o_s_2.png',
    'na_10_kururu_o_s_2_s2.png',
    'na_10_kururu_a1_s_3.png',
    'na_10_kururu_a1_s_3_ex1.png',
    'na_10_kururu_o_s_4.png',
  ],
  'サリヤ': [
    'na_11_thallya_o_n_1.png',
    'na_11_thallya_o_n_2.png',
    'na_11_thallya_o_n_3.png',
    'na_11_thallya_o_n_4.png',
    'na_11_thallya_o_n_5.png',
    'na_11_thallya_o_n_6.png',
    'na_11_thallya_o_n_7.png',
    'na_11_thallya_o_s_1.png',
    'na_11_thallya_o_s_2.png',
    // 'na_11_thallya_o_s_3.png',
    'na_11_thallya_o_s_3_s3.png',
    // 'na_11_thallya_o_s_4.png',
    'na_11_thallya_o_s_4_s3.png',
    // 'na_11_thallya_o_tf_1.png',
    'na_11_thallya_o_tf_1_s2.png',
    'na_11_thallya_o_tf_2.png',
    'na_11_thallya_o_tf_3.png',
  ],
  'サリヤ (A1)': [
    'na_11_thallya_o_n_1.png',
    'na_11_thallya_o_n_2.png',
    'na_11_thallya_o_n_3.png',
    'na_11_thallya_o_n_4.png',
    'na_11_thallya_a1_n_5.png',
    'na_11_thallya_o_n_6.png',
    'na_11_thallya_o_n_7.png',
    'na_11_thallya_a1_s_1.png',
    'na_11_thallya_a1_s_2.png',
    // 'na_11_thallya_o_s_3.png',
    'na_11_thallya_o_s_3_s3.png',
    // 'na_11_thallya_o_s_4.png',
    'na_11_thallya_o_s_4_s3.png',
    // 'na_11_thallya_o_tf_1.png',
    'na_11_thallya_a1_tf_1.png',
    'na_11_thallya_o_tf_2.png',
    // 'na_11_thallya_a1_tf_3.png',
    'na_11_thallya_a1_tf_3_s6.png',
    'na_11_thallya_a1_tf_4.png',
  ],
  'ライラ': [
    // 'na_12_raira_o_n_1.png',
    'na_12_raira_o_n_1_s2.png',
    'na_12_raira_o_n_2.png',
    'na_12_raira_o_n_3.png',
    'na_12_raira_o_n_4.png',
    'na_12_raira_o_n_5.png',
    'na_12_raira_o_n_6.png',
    'na_12_raira_o_n_7.png',
    'na_12_raira_o_s_1.png',
    'na_12_raira_o_s_2.png',
    // 'na_12_raira_o_s_3.png',
    'na_12_raira_o_s_3_ex1.png',
    'na_12_raira_o_s_3_ex2.png',
    'na_12_raira_o_s_3_ex3.png',
    'na_12_raira_o_s_3_s4.png',
    // 'na_12_raira_o_s_4.png',
    'na_12_raira_o_s_4_s5.png',
  ],
  'ライラ (A1)': [
    // 'na_12_raira_o_n_1.png',
    'na_12_raira_o_n_1_s2.png',
    // 'na_12_raira_a1_n_2.png',
    'na_12_raira_a1_n_2_s6.png',
    'na_12_raira_o_n_3.png',
    'na_12_raira_o_n_4.png',
    'na_12_raira_o_n_5.png',
    'na_12_raira_a1_n_6.png',
    'na_12_raira_o_n_7.png',
    'na_12_raira_o_s_1.png',
    'na_12_raira_o_s_2.png',
    'na_12_raira_a1_s_3.png',
    // 'na_12_raira_o_s_4.png',
    'na_12_raira_o_s_4_s5.png',
    // 'na_12_raira_a1_st.png',
    'na_12_raira_a1_st_s6.png',
  ],
  'ウツロ': [
    'na_13_utsuro_o_n_1.png',
    'na_13_utsuro_o_n_2.png',
    'na_13_utsuro_o_n_3.png',
    'na_13_utsuro_o_n_4.png',
    'na_13_utsuro_o_n_5.png',
    'na_13_utsuro_o_n_6.png',
    'na_13_utsuro_o_n_7.png',
    'na_13_utsuro_o_s_1.png',
    'na_13_utsuro_o_s_2.png',
    'na_13_utsuro_o_s_3.png',
    // 'na_13_utsuro_o_s_4.png',
    'na_13_utsuro_o_s_4_s5.png',
  ],
  'ウツロ (A1)': [
    'na_13_utsuro_o_n_1.png',
    'na_13_utsuro_a1_n_2.png',
    'na_13_utsuro_o_n_3.png',
    'na_13_utsuro_o_n_4.png',
    'na_13_utsuro_o_n_5.png',
    'na_13_utsuro_o_n_6.png',
    'na_13_utsuro_o_n_7.png',
    // 'na_13_utsuro_a1_s_1.png',
    'na_13_utsuro_a1_s_1_ex1.png',
    'na_13_utsuro_a1_s_1_ex2.png',
    'na_13_utsuro_a1_s_1_ex3.png',
    'na_13_utsuro_a1_s_1_ex4.png',
    'na_13_utsuro_a1_s_1_s4.png',
    'na_13_utsuro_o_s_2.png',
    'na_13_utsuro_o_s_3.png',
    // 'na_13_utsuro_o_s_4.png',
    'na_13_utsuro_o_s_4_s5.png',
  ],
  'ホノカ': [
    'na_14_honoka_o_n_1.png',
    'na_14_honoka_o_n_1_ex1.png',
    'na_14_honoka_o_n_1_ex2.png',
    'na_14_honoka_o_n_1_ex3.png',
    // 'na_14_honoka_o_n_2.png',
    'na_14_honoka_o_n_2_s5.png',
    'na_14_honoka_o_n_3.png',
    'na_14_honoka_o_n_4.png',
    'na_14_honoka_o_n_4_ex1.png',
    'na_14_honoka_o_n_5.png',
    'na_14_honoka_o_n_5_ex1.png',
    // 'na_14_honoka_o_n_6.png',
    'na_14_honoka_o_n_6_s4.png',
    'na_14_honoka_o_n_7.png',
    'na_14_honoka_o_s_1.png',
    // 'na_14_honoka_o_s_1_ex1.png',
    'na_14_honoka_o_s_1_ex1_s5.png',
    'na_14_honoka_o_s_1_ex2.png',
    'na_14_honoka_o_s_2.png',
    // 'na_14_honoka_o_s_3.png',
    'na_14_honoka_o_s_3_s4.png',
    'na_14_honoka_o_s_4.png',
  ],
  'ホノカ (A1)': [
    'na_14_honoka_a1_n_1.png',
    'na_14_honoka_a1_n_1_ex1.png',
    // 'na_14_honoka_o_n_2.png',
    'na_14_honoka_o_n_2_s5.png',
    'na_14_honoka_o_n_3.png',
    'na_14_honoka_o_n_4.png',
    'na_14_honoka_o_n_4_ex1.png',
    'na_14_honoka_o_n_5.png',
    'na_14_honoka_o_n_5_ex1.png',
    // 'na_14_honoka_o_n_6.png',
    'na_14_honoka_o_n_6_s4.png',
    'na_14_honoka_o_n_7.png',
    'na_14_honoka_a1_s_1.png',
    'na_14_honoka_a1_s_1_ex1.png',
    'na_14_honoka_a1_s_1_ex2.png',
    'na_14_honoka_a1_s_1_ex3.png',
    'na_14_honoka_a1_s_1_ex4.png',
    'na_14_honoka_a1_s_1_ex5.png',
    'na_14_honoka_o_s_2.png',
    // 'na_14_honoka_o_s_3.png',
    'na_14_honoka_o_s_3_s4.png',
    'na_14_honoka_o_s_4.png',
  ],
  'コルヌ': [
    'na_15_korunu_o_n_1.png',
    'na_15_korunu_o_n_2.png',
    'na_15_korunu_o_n_3.png',
    'na_15_korunu_o_n_4.png',
    'na_15_korunu_o_n_5.png',
    'na_15_korunu_o_n_6.png',
    // 'na_15_korunu_o_n_7.png',
    'na_15_korunu_o_n_7_s6.png',
    'na_15_korunu_o_s_1.png',
    'na_15_korunu_o_s_2.png',
    'na_15_korunu_o_s_3.png',
    // 'na_15_korunu_o_s_4.png',
    'na_15_korunu_o_s_4_s6.png',
  ],
  'ヤツハ': [
    // 'na_16_yatsuha_o_n_1.png',
    'na_16_yatsuha_o_n_1_s5.png',
    // 'na_16_yatsuha_o_n_2.png',
    'na_16_yatsuha_o_n_2_s5.png',
    'na_16_yatsuha_o_n_3.png',
    'na_16_yatsuha_o_n_4.png',
    'na_16_yatsuha_o_n_5.png',
    'na_16_yatsuha_o_n_6.png',
    'na_16_yatsuha_o_n_7.png',
    'na_16_yatsuha_o_s_1.png',
    'na_16_yatsuha_o_s_2.png',
    'na_16_yatsuha_o_s_3.png',
    'na_16_yatsuha_o_s_4.png',
  ],
  'ハツミ': [
    'na_17_hatsumi_o_n_1.png',
    'na_17_hatsumi_o_n_2.png',
    'na_17_hatsumi_o_n_3.png',
    'na_17_hatsumi_o_n_4.png',
    'na_17_hatsumi_o_n_5.png',
    'na_17_hatsumi_o_n_6.png',
    'na_17_hatsumi_o_n_7.png',
    'na_17_hatsumi_o_s_1.png',
    'na_17_hatsumi_o_s_2.png',
    'na_17_hatsumi_o_s_3.png',
    'na_17_hatsumi_o_s_4.png',
  ],
  'ミズキ': [
    'na_18_mizuki_o_n_1.png',
    // 'na_18_mizuki_o_n_2.png',
    'na_18_mizuki_o_n_2_s6.png',
    'na_18_mizuki_o_n_3.png',
    'na_18_mizuki_o_n_4.png',
    'na_18_mizuki_o_n_5.png',
    // 'na_18_mizuki_o_n_6.png',
    'na_18_mizuki_o_n_6_s6.png',
    'na_18_mizuki_o_n_7.png',
    'na_18_mizuki_o_s_1.png',
    'na_18_mizuki_o_s_2.png',
    'na_18_mizuki_o_s_3.png',
    'na_18_mizuki_o_s_3_ex1.png',
    'na_18_mizuki_o_s_4.png',
    'na_18_mizuki_o_t_1.png',
    'na_18_mizuki_o_t_1.png',
    'na_18_mizuki_o_t_2.png',
    'na_18_mizuki_o_t_3.png',
  ],
  'メグミ': [
    'na_19_megumi_o_n_1.png',
    'na_19_megumi_o_n_2.png',
    'na_19_megumi_o_n_3.png',
    'na_19_megumi_o_n_4.png',
    'na_19_megumi_o_n_5.png',
    'na_19_megumi_o_n_6.png',
    'na_19_megumi_o_n_7.png',
    'na_19_megumi_o_s_1.png',
    'na_19_megumi_o_s_2.png',
    'na_19_megumi_o_s_3.png',
    'na_19_megumi_o_s_4.png',
  ],
  'カナエ': [
    'na_20_kanawe_o_n_1.png',
    'na_20_kanawe_o_n_2.png',
    'na_20_kanawe_o_n_3.png',
    'na_20_kanawe_o_n_4.png',
    'na_20_kanawe_o_n_5.png',
    'na_20_kanawe_o_n_6.png',
    'na_20_kanawe_o_n_7.png',
    'na_20_kanawe_o_p_1.png',
    'na_20_kanawe_o_p_2.png',
    'na_20_kanawe_o_p_3.png',
    'na_20_kanawe_o_p_4.png',
    'na_20_kanawe_o_p_5.png',
    'na_20_kanawe_o_p_6.png',
    'na_20_kanawe_o_s_1.png',
    'na_20_kanawe_o_s_2.png',
    'na_20_kanawe_o_s_3.png',
    'na_20_kanawe_o_s_4.png',
  ]
}

const FURUYONI_COMPONENTS = {
  'シンラ': [
    {
      name: '計略トークン',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/plan_blue.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/plan_back.png',
      size: 1.5
    },
    {
      name: '計略トークン',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/plan_red.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/plan_back.png',
      size: 1.5
    },
    {
      name: '計略ボード',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/plan_board.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/plan_board.png',
      size: 3.2
    },
  ],
  'サリヤ': [
    {
      name: 'マシンボード',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/machine_board.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/machine_board.png',
      size: 4.4
    },
    {
      name: '造花結晶 (1P)',
      front: './assets/furuyoni_commons_custom/machine_token_1x1.png',
      back: './assets/furuyoni_commons_custom/machine_token_1x1.png',
      size: 1.2
    },
    {
      name: '造花結晶 (2P)',
      front: './assets/furuyoni_commons_custom/machine_token_2_1x1.png',
      back: './assets/furuyoni_commons_custom/machine_token_2_1x1.png',
      size: 1.2
    },
  ],
  'ライラ': [
    {
      name: '風雷ボード',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/furai_board.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/furai_board.png',
      size: 5.8
    },
    {
      name: '風神トークン',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/fujin_0x.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/fujin_1x.png',
      size: 1.5
    },
    {
      name: '雷神トークン',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/raijin_0x.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/raijin_1x.png',
      size: 1.5
    },
  ],
  'コルヌ': [
    {
      name: '凍結トークン',
      front: './assets/furuyoni_commons_custom/frozen_token_1x1.png',
      back: './assets/furuyoni_commons_custom/frozen_token_1x1.png',
      size: 1.2,
    }
  ],
  'ミズキ': [
    {
      name: '兵舎ボード',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/barrack_board.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/barrack_board.png',
      size: 5.8
    },
  ],
  'メグミ': [
    {
      name: '土壌ボード',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/soil_board.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/soil_board.png',
      size: 4.4
    },
    {
      name: '種結晶',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/seed_token.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/seed_token.png',
      size: 0.7
    },
  ],
  'カナエ': [
    {
      name: '構想ボード',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/story_board.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/story_board.png',
      size: 5.8
    },
    {
      name: '仮面トークン',
      front: './assets/furuyoni_commons_na/furuyoni_na/board_token/mask_token.png',
      back: './assets/furuyoni_commons_na/furuyoni_na/board_token/mask_token.png',
      size: 1
    },
  ]
}

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

  createTarot(tarot: Tarot) {
    let card = Card.create(tarot.name, tarot.image.url, this.tarotBack.url, 2);
    card.uplight();
    SoundEffect.play(PresetSound.cardDraw);
  }

  private getCardBack(filename: string): string {
    const backNormal = 'cardback_normal.png';
    let back: string;

    switch (filename) {
      case 'na_08_hagane_a1_s_1_ex1.png': back = backNormal; break;
      case 'na_10_kururu_o_s_3_ex1.png': back = backNormal; break;
      case 'na_13_utsuro_a1_s_1_ex2.png': back = backNormal; break;
      case 'na_13_utsuro_a1_s_1_ex3.png': back = backNormal; break;
      case 'na_13_utsuro_a1_s_1_ex4.png': back = backNormal; break;
      case 'na_14_honoka_a1_s_1_ex1.png': back = backNormal; break;
      case 'na_14_honoka_a1_s_1_ex2.png': back = backNormal; break;
      case 'na_18_mizuki_o_s_3_ex1.png': back = backNormal; break;
      case 'na_20_kanawe_o_p_1.png': back = 'na_20_kanawe_o_p_1_w.png'; break;
      case 'na_20_kanawe_o_p_2.png': back = 'na_20_kanawe_o_p_2_w.png'; break;
      case 'na_20_kanawe_o_p_3.png': back = 'na_20_kanawe_o_p_3_w.png'; break;
      case 'na_20_kanawe_o_p_4.png': back = 'na_20_kanawe_o_p_4_w.png'; break;
      case 'na_20_kanawe_o_p_5.png': back = 'na_20_kanawe_o_p_5_w.png'; break;
      case 'na_20_kanawe_o_p_6.png': back = 'na_20_kanawe_o_p_6_w.png'; break;
      case 'umbrella_a.png': back = 'umbrella_b.png'; break;
    }

    if (!back) {
      switch (filename.match(/^na_\d{2}_[a-z]+_(?:o|a\d)_(.)/)[1]) {
        case 'n': back = backNormal; break;
        case 'p': back = 'cardback_poison.png'; break;
        case 's': back = 'cardback_special.png'; break;
        case 'tf': back = 'cardback_transform.png'; break;
        case 't': back = 'cardback_troop.png'; break;
        default: throw Error;
      }
    }

    back = './assets/furuyoni_commons_na/furuyoni_na/cards/' + back;

    if (!this.fileStorageService.get(back)) {
      this.fileStorageService.add(back);
    }

    return back;
  }

  createDeck(name: string) {
    let cardStack = CardStack.create(name);
    MEGAMI_CARDS[name].forEach(filename => {
      const path = `./assets/furuyoni_commons_na/furuyoni_na/cards/${filename}`;
      if (!this.fileStorageService.get(path)) {
        this.fileStorageService.add(path);
      }
      let card = Card.create('カード', path, this.getCardBack(filename));
      cardStack.putOnBottom(card);
    })
  }

  showTarotContextMenu(tarot: Tarot, e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.pointerDeviceService.isAllowedToOpenContextMenu) return;

    let position = this.pointerDeviceService.pointers[0];
    let menu = [
      {
        name: 'タロットを作成', action: () => {
          this.createTarot(tarot);
        }
      },
      {
        name: '山札を作成', action: () => {
          this.createDeck(tarot.name);
        }
      }
    ];
    if (FURUYONI_COMPONENTS[tarot.name]) {
      FURUYONI_COMPONENTS[tarot.name].forEach(component => {
        menu.push({
          name: component.name, action: () => {
            if (!this.fileStorageService.get(component.front)) {
              this.fileStorageService.add(component.front);
            }
            if (!this.fileStorageService.get(component.back)) {
              this.fileStorageService.add(component.back);
            }
            Card.create(component.name, component.front, component.back, component.size);
          }
        })
      })
    }
    this.contextMenuService.open(position, menu, tarot.name);
  }

  private setupTarot() {
    MEGAMI_TAROTS.forEach(([name, filename]) => {
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
