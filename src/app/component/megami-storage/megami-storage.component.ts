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
    ['斬', 'na_01_yurina_o_n_1.png'],
    ['一閃', 'na_01_yurina_o_n_2.png'],
    ['柄打ち', 'na_01_yurina_o_n_3.png'],
    // ['居合', 'na_01_yurina_o_n_4.png'],
    ['居合', 'na_01_yurina_o_n_4_s2.png'],
    // ['足捌き', 'na_01_yurina_o_n_5.png'],
    // ['足捌き', 'na_01_yurina_o_n_5_s2.png'],
    ['気迫', 'na_01_yurina_o_n_5_s5.png'],
    ['圧気', 'na_01_yurina_o_n_6.png'],
    ['気炎万丈', 'na_01_yurina_o_n_7.png'],
    ['月影落', 'na_01_yurina_o_s_1.png'],
    // ['浦波嵐', 'na_01_yurina_o_s_2.png'],
    ['浦波嵐', 'na_01_yurina_o_s_2_s5.png'],
    // ['浮舟宿', 'na_01_yurina_o_s_3.png'],
    ['浮舟宿', 'na_01_yurina_o_s_3_s2.png'],
    ['天音揺波の底力', 'na_01_yurina_o_s_4.png'],
  ],
  'ユリナ (A1)': [
    ['乱打', 'na_01_yurina_a1_n_1.png'],
    ['一閃', 'na_01_yurina_o_n_2.png'],
    ['柄打ち', 'na_01_yurina_o_n_3.png'],
    // ['居合', 'na_01_yurina_o_n_4.png'],
    ['居合', 'na_01_yurina_o_n_4_s2.png'],
    // ['足捌き', 'na_01_yurina_o_n_5.png'],
    // ['足捌き', 'na_01_yurina_o_n_5_s2.png'],
    ['気迫', 'na_01_yurina_o_n_5_s5.png'],
    ['癇癪玉', 'na_01_yurina_a1_n_6.png'],
    ['気炎万丈', 'na_01_yurina_o_n_7.png'],
    ['月影落', 'na_01_yurina_o_s_1.png'],
    // ['不完全浦波嵐', 'na_01_yurina_a1_s_2.png'],
    ['不完全浦波嵐', 'na_01_yurina_a1_s_2_s5.png'],
    // ['浮舟宿', 'na_01_yurina_o_s_3.png'],
    ['浮舟宿', 'na_01_yurina_o_s_3_s2.png'],
    ['天音揺波の底力', 'na_01_yurina_o_s_4.png'],
  ],
  'サイネ': [
    ['八方振り', 'na_02_saine_o_n_1.png'],
    ['薙斬り', 'na_02_saine_o_n_2.png'],
    // ['返し刃', 'na_02_saine_o_n_3.png'],
    ['石突', 'na_02_saine_o_n_3_s3.png'],
    ['見切り', 'na_02_saine_o_n_4.png'],
    // ['圏域', 'na_02_saine_o_n_5.png'],
    ['圏域', 'na_02_saine_o_n_5_s5.png'],
    // ['衝音晶', 'na_02_saine_o_n_6.png'],
    ['衝音晶', 'na_02_saine_o_n_6_s3.png'],
    ['無音壁', 'na_02_saine_o_n_7.png'],
    // ['律動弧戟', 'na_02_saine_o_s_1.png'],
    ['律動弧戟', 'na_02_saine_o_s_1_s2.png'],
    // ['響鳴共振', 'na_02_saine_o_s_2.png'],
    ['響鳴共振', 'na_02_saine_o_s_2_s2.png'],
    // ['音無砕氷', 'na_02_saine_o_s_3.png'],
    ['音無砕氷', 'na_02_saine_o_s_3_s2.png'],
    // ['氷雨細音の果ての果て', 'na_02_saine_o_s_4.png'],
    ['氷雨細音の果ての果て', 'na_02_saine_o_s_4_s2.png'],
  ],
  'サイネ (A1)': [
    ['八方振り', 'na_02_saine_o_n_1.png'],
    ['薙斬り', 'na_02_saine_o_n_2.png'],
    ['氷の音', 'na_02_saine_a1_n_3.png'],
    ['見切り', 'na_02_saine_o_n_4.png'],
    // ['圏域', 'na_02_saine_o_n_5.png'],
    ['圏域', 'na_02_saine_o_n_5_s5.png'],
    ['伴奏', 'na_02_saine_a1_n_6.png'],
    ['無音壁', 'na_02_saine_o_n_7.png'],
    // ['律動弧戟', 'na_02_saine_o_s_1.png'],
    ['律動弧戟', 'na_02_saine_o_s_1_s2.png'],
    ['二重奏:弾奏氷瞑', 'na_02_saine_a1_s_2.png'],
    // ['音無砕氷', 'na_02_saine_o_s_3.png'],
    ['音無砕氷', 'na_02_saine_o_s_3_s2.png'],
    // ['氷雨細音の果ての果て', 'na_02_saine_o_s_4.png'],
    ['氷雨細音の果ての果て', 'na_02_saine_o_s_4_s2.png'],
  ],
  'サイネ (A2)': [
    ['八方振り', 'na_02_saine_o_n_1.png'],
    ['裏斬り', 'na_02_saine_a2_n_2.png'],
    // ['返し刃', 'na_02_saine_o_n_3.png'],
    ['石突', 'na_02_saine_o_n_3_s3.png'],
    ['見切り', 'na_02_saine_o_n_4.png'],
    // ['圏域', 'na_02_saine_o_n_5.png'],
    ['圏域', 'na_02_saine_o_n_5_s5.png'],
    // ['', 'na_02_saine_o_n_6.png'],
    ['衝音晶', 'na_02_saine_o_n_6_s3.png'],
    ['遺響壁', 'na_02_saine_a2_n_7.png'],
    // ['律動弧戟', 'na_02_saine_o_s_1.png'],
    ['律動弧戟', 'na_02_saine_o_s_1_s2.png'],
    // ['響鳴共振', 'na_02_saine_o_s_2.png'],
    ['響鳴共振', 'na_02_saine_o_s_2_s2.png'],
    ['絶唱絶華', 'na_02_saine_a2_s_3.png'],
    // ['氷雨細音の果ての果て', 'na_02_saine_o_s_4.png'],
    ['氷雨細音の果ての果て', 'na_02_saine_o_s_4_s2.png'],
  ],
  'ヒミカ': [
    ['シュート', 'na_03_himika_o_n_1.png'],
    // ['ラピッドファイア', 'na_03_himika_o_n_2.png'],
    ['ラピッドファイア', 'na_03_himika_o_n_2_s4.png'],
    ['マグナムカノン', 'na_03_himika_o_n_3.png'],
    ['フルバースト', 'na_03_himika_o_n_4.png'],
    ['バックステップ', 'na_03_himika_o_n_5.png'],
    // ['バックドラフト', 'na_03_himika_o_n_6.png'],
    ['バックドラフト', 'na_03_himika_o_n_6_s5.png'],
    ['スモーク', 'na_03_himika_o_n_7.png'],
    ['レッドバレット', 'na_03_himika_o_s_1.png'],
    ['クリムゾンゼロ', 'na_03_himika_o_s_2.png'],
    ['スカーレットイマジン', 'na_03_himika_o_s_3.png'],
    ['ヴァーミリオンフィールド', 'na_03_himika_o_s_4.png'],
  ],
  'ヒミカ (A1)': [
    ['シュート', 'na_03_himika_o_n_1.png'],
    ['火炎流', 'na_03_himika_a1_n_2.png'],
    ['マグナムカノン', 'na_03_himika_o_n_3.png'],
    ['フルバースト', 'na_03_himika_o_n_4.png'],
    ['殺意', 'na_03_himika_a1_n_5.png'],
    // ['バックドラフト', 'na_03_himika_o_n_6.png'],
    ['バックドラフト', 'na_03_himika_o_n_6_s5.png'],
    ['スモーク', 'na_03_himika_o_n_7.png'],
    ['レッドバレット', 'na_03_himika_o_s_1.png'],
    ['炎天・紅緋弥香', 'na_03_himika_a1_s_2.png'],
    ['スカーレットイマジン', 'na_03_himika_o_s_3.png'],
    ['ヴァーミリオンフィールド', 'na_03_himika_o_s_4.png'],
  ],
  'トコヨ': [
    // ['梳流し', 'na_04_tokoyo_o_n_1.png'],
    ['梳流し', 'na_04_tokoyo_o_n_1_s2.png'],
    ['雅打ち', 'na_04_tokoyo_o_n_2.png'],
    ['跳ね兎', 'na_04_tokoyo_o_n_3.png'],
    ['詩舞', 'na_04_tokoyo_o_n_4.png'],
    ['要返し', 'na_04_tokoyo_o_n_5.png'],
    ['風舞台', 'na_04_tokoyo_o_n_6.png'],
    // ['晴舞台', 'na_04_tokoyo_o_n_7.png'],
    ['晴舞台', 'na_04_tokoyo_o_n_7_s2.png'],
    ['久遠ノ花', 'na_04_tokoyo_o_s_1.png'],
    ['千歳ノ鳥', 'na_04_tokoyo_o_s_2.png'],
    // ['無窮ノ風', 'na_04_tokoyo_o_s_3.png'],
    ['無窮ノ風', 'na_04_tokoyo_o_s_3_s2.png'],
    ['常世ノ月', 'na_04_tokoyo_o_s_4.png'],
  ],
  'トコヨ (A1)': [
    ['奏流し', 'na_04_tokoyo_a1_n_1.png'],
    ['雅打ち', 'na_04_tokoyo_o_n_2.png'],
    ['跳ね兎', 'na_04_tokoyo_o_n_3.png'],
    ['詩舞', 'na_04_tokoyo_o_n_4.png'],
    ['陽の音', 'na_04_tokoyo_a1_n_5_s3.png'],
    ['風舞台', 'na_04_tokoyo_o_n_6.png'],
    ['晴舞台', 'na_04_tokoyo_o_n_7_s2.png'],
    ['久遠ノ花', 'na_04_tokoyo_o_s_1.png'],
    // ['二重奏:吹弾陽明', 'na_04_tokoyo_a1_s_2.png'],
    ['二重奏:吹弾陽明', 'na_04_tokoyo_a1_s_2_s3.png'],
    // ['無窮ノ風', 'na_04_tokoyo_o_s_3.png'],
    ['無窮ノ風', 'na_04_tokoyo_o_s_3_s2.png'],
    ['常世ノ月', 'na_04_tokoyo_o_s_4.png'],
  ],
  'トコヨ (A2)': [
    // ['梳流し', 'na_04_tokoyo_o_n_1.png'],
    ['梳流し', 'na_04_tokoyo_o_n_1_s2.png'],
    ['畏掠め', 'na_04_tokoyo_a2_n_2.png'],
    ['跳ね兎', 'na_04_tokoyo_o_n_3.png'],
    ['詩舞', 'na_04_tokoyo_o_n_4.png'],
    ['要返し', 'na_04_tokoyo_o_n_5.png'],
    ['風舞台', 'na_04_tokoyo_o_n_6.png'],
    // ['晴舞台', 'na_04_tokoyo_o_n_7.png'],
    ['晴舞台', 'na_04_tokoyo_o_n_7_s2.png'],
    ['久遠ノ花', 'na_04_tokoyo_o_s_1.png'],
    ['悠久ノ雪', 'na_04_tokoyo_a2_s_2.png'],
    ['徒寄ノ八重桜', 'na_04_tokoyo_a2_s_3.png'],
    ['常世ノ月', 'na_04_tokoyo_o_s_4.png'],
  ],
  'オボロ': [
    ['鋼糸', 'na_05_oboro_o_n_1.png'],
    // ['影菱', 'na_05_oboro_o_n_2.png'],
    ['影菱', 'na_05_oboro_o_n_2_s2.png'],
    ['斬撃乱舞', 'na_05_oboro_o_n_3.png'],
    // ['忍歩', 'na_05_oboro_o_n_4.png'],
    ['忍歩', 'na_05_oboro_o_n_4_s3.png'],
    ['誘導', 'na_05_oboro_o_n_5.png'],
    ['分身の術', 'na_05_oboro_o_n_6.png'],
    ['生体活性', 'na_05_oboro_o_n_7.png'],
    ['熊介', 'na_05_oboro_o_s_1.png'],
    // ['鳶影', 'na_05_oboro_o_s_2.png'],
    ['鳶影', 'na_05_oboro_o_s_2_s3.png'],
    ['虚魚', 'na_05_oboro_o_s_3.png'],
    // ['壬蔓', 'na_05_oboro_o_s_4.png'],
    ['壬蔓', 'na_05_oboro_o_s_4_s3.png'],
  ],
  'オボロ (A1)': [
    ['鋼糸', 'na_05_oboro_o_n_1.png'],
    ['手裏剣', 'na_05_oboro_a1_n_2.png'],
    // ['不意打ち', 'na_05_oboro_a1_n_3.png'],
    ['不意打ち', 'na_05_oboro_a1_n_3_s5.png'],
    // ['忍歩', 'na_05_oboro_o_n_4.png'],
    ['忍歩', 'na_05_oboro_o_n_4_s3.png'],
    ['誘導', 'na_05_oboro_o_n_5.png'],
    ['分身の術', 'na_05_oboro_o_n_6.png'],
    ['生体活性', 'na_05_oboro_o_n_7.png'],
    ['熊介', 'na_05_oboro_o_s_1.png'],
    // ['鳶影', 'na_05_oboro_o_s_2.png'],
    ['鳶影', 'na_05_oboro_o_s_2_s3.png'],
    ['虚魚', 'na_05_oboro_o_s_3.png'],
    ['神代枝', 'na_05_oboro_a1_s_4.png'],
    // ['最後の結晶', 'na_05_oboro_a1_s_4_ex1.png'],
    ['最後の結晶', 'na_05_oboro_a1_s_4_ex1_s5.png'],
  ],
  'ユキヒ': [
    ['しこみばり / ふくみばり', 'na_06_yukihi_o_n_1.png'],
    ['しこみび / ねこだまし', 'na_06_yukihi_o_n_2.png'],
    ['ふりはらい / たぐりよせ', 'na_06_yukihi_o_n_3.png'],
    ['ふりまわし / つきさし', 'na_06_yukihi_o_n_4.png'],
    ['かさまわし', 'na_06_yukihi_o_n_5.png'],
    ['ひきあし / もぐりこみ', 'na_06_yukihi_o_n_6.png'],
    ['えんむすび', 'na_06_yukihi_o_n_7.png'],
    ['はらりゆき', 'na_06_yukihi_o_s_1.png'],
    ['ゆらりび', 'na_06_yukihi_o_s_2.png'],
    ['どろりうら', 'na_06_yukihi_o_s_3.png'],
    ['くるりみ', 'na_06_yukihi_o_s_4.png'],
    ['傘カード', 'umbrella_a.png'],
  ],
  'ユキヒ (A1)': [
    ['しこみばり / ふくみばり', 'na_06_yukihi_o_n_1.png'],
    ['ちからぞえ / おどしつけ', 'na_06_yukihi_a1_n_2.png'],
    ['ふりはらい / たぐりよせ', 'na_06_yukihi_o_n_3.png'],
    ['よこいと / たていと', 'na_06_yukihi_a1_n_4.png'],
    ['かさまわし', 'na_06_yukihi_o_n_5.png'],
    ['ひきあし / もぐりこみ', 'na_06_yukihi_o_n_6.png'],
    ['えんむすび', 'na_06_yukihi_o_n_7.png'],
    ['はらりゆき', 'na_06_yukihi_o_s_1.png'],
    ['ひらりおり', 'na_06_yukihi_a1_s_2.png'],
    ['どろりうら', 'na_06_yukihi_o_s_3.png'],
    ['くるりみ', 'na_06_yukihi_o_s_4.png'],
    ['傘カード', 'umbrella_a.png'],
  ],
  'シンラ': [
    ['立論', 'na_07_shinra_o_n_1.png'],
    ['反論', 'na_07_shinra_o_n_2.png'],
    ['詭弁', 'na_07_shinra_o_n_3.png'],
    ['引用', 'na_07_shinra_o_n_4.png'],
    ['煽動', 'na_07_shinra_o_n_5.png'],
    // ['壮語', 'na_07_shinra_o_n_6.png'],
    ['壮語', 'na_07_shinra_o_n_6_s3.png'],
    ['論破', 'na_07_shinra_o_n_7.png'],
    // ['完全論破', 'na_07_shinra_o_s_1.png'],
    ['完全論破', 'na_07_shinra_o_s_1_s6.png'],
    // ['皆式理解', 'na_07_shinra_o_s_2.png'],
    ['皆式理解', 'na_07_shinra_o_s_2_s2.png'],
    ['天地反駁', 'na_07_shinra_o_s_3.png'],
    ['森羅判証', 'na_07_shinra_o_s_4.png'],
  ],
  'シンラ (A1)': [
    ['立論', 'na_07_shinra_o_n_1.png'],
    ['真言', 'na_07_shinra_a1_n_2.png'],
    ['詭弁', 'na_07_shinra_o_n_3.png'],
    ['引用', 'na_07_shinra_o_n_4.png'],
    ['煽動', 'na_07_shinra_o_n_5.png'],
    // ['壮語', 'na_07_shinra_o_n_6.png'],
    ['壮語', 'na_07_shinra_o_n_6_s3.png'],
    ['使徒', 'na_07_shinra_a1_n_7.png'],
    // ['完全論破', 'na_07_shinra_o_s_1.png'],
    ['完全論破', 'na_07_shinra_o_s_1_s6.png'],
    // ['皆式理解', 'na_07_shinra_o_s_2.png'],
    ['皆式理解', 'na_07_shinra_o_s_2_s2.png'],
    ['全知経典', 'na_07_shinra_a1_s_3.png'],
    ['森羅判証', 'na_07_shinra_o_s_4.png'],
  ],
  'ハガネ': [
    // ['遠心撃', 'na_08_hagane_o_n_1.png'],
    ['遠心撃', 'na_08_hagane_o_n_1_s2.png'],
    ['砂風塵', 'na_08_hagane_o_n_2.png'],
    ['大地砕き', 'na_08_hagane_o_n_3.png'],
    ['超反発', 'na_08_hagane_o_n_4.png'],
    ['円舞錬', 'na_08_hagane_o_n_5.png'],
    ['鐘鳴らし', 'na_08_hagane_o_n_6.png'],
    ['引力場', 'na_08_hagane_o_n_7.png'],
    // ['大天空クラッシュ', 'na_08_hagane_o_s_1.png'],
    ['大天空クラッシュ', 'na_08_hagane_o_s_1_s5.png'],
    ['大破鐘メガロベル', 'na_08_hagane_o_s_2.png'],
    ['大重力アトラクト', 'na_08_hagane_o_s_3.png'],
    ['大山脈リスペクト', 'na_08_hagane_o_s_4.png'],
  ],
  'ハガネ (A1)': [
    ['炉火', 'na_08_hagane_a1_n_1.png'],
    ['旋回起', 'na_08_hagane_a1_n_2.png'],
    ['大地砕き', 'na_08_hagane_o_n_3.png'],
    ['超反発', 'na_08_hagane_o_n_4.png'],
    ['円舞錬', 'na_08_hagane_o_n_5.png'],
    ['鐘鳴らし', 'na_08_hagane_o_n_6.png'],
    ['引力場', 'na_08_hagane_o_n_7.png'],
    ['大錬成マテリアル', 'na_08_hagane_a1_s_1.png'],
    ['錬成攻撃', 'na_08_hagane_a1_s_1_ex1.png'],
    ['大破鐘メガロベル', 'na_08_hagane_o_s_2.png'],
    ['大重力アトラクト', 'na_08_hagane_o_s_3.png'],
    ['大山脈リスペクト', 'na_08_hagane_o_s_4.png'],
  ],
  'チカゲ': [
    ['飛苦無', 'na_09_chikage_o_n_1.png'],
    ['毒針', 'na_09_chikage_o_n_2.png'],
    // ['遁術', 'na_09_chikage_o_n_3.png'],
    ['遁術', 'na_09_chikage_o_n_3_s5.png'],
    ['首切り', 'na_09_chikage_o_n_4.png'],
    ['毒霧', 'na_09_chikage_o_n_5.png'],
    ['抜き足', 'na_09_chikage_o_n_6.png'],
    ['泥濘', 'na_09_chikage_o_n_7.png'],
    ['麻痺毒', 'na_09_chikage_o_p_1.png'],
    ['幻覚毒', 'na_09_chikage_o_p_2.png'],
    ['弛緩毒', 'na_09_chikage_o_p_3.png'],
    ['滅灯毒', 'na_09_chikage_o_p_4.png'],
    ['滅灯毒', 'na_09_chikage_o_p_4.png'],
    ['滅灯の魂毒', 'na_09_chikage_o_s_1.png'],
    ['叛旗の纏毒', 'na_09_chikage_o_s_2.png'],
    ['流転の霞毒', 'na_09_chikage_o_s_3.png'],
    ['闇昏千影の生きる道', 'na_09_chikage_o_s_4.png'],
  ],
  'チカゲ (A1)': [
    ['飛苦無', 'na_09_chikage_o_n_1.png'],
    ['毒針', 'na_09_chikage_o_n_2.png'],
    // ['遁術', 'na_09_chikage_o_n_3.png'],
    ['遁術', 'na_09_chikage_o_n_3_s5.png'],
    ['首切り', 'na_09_chikage_o_n_4.png'],
    ['仕掛け番傘', 'na_09_chikage_a1_n_5.png'],
    ['奮迅', 'na_09_chikage_a1_n_6.png'],
    ['泥濘', 'na_09_chikage_o_n_7.png'],
    ['麻痺毒', 'na_09_chikage_o_p_1.png'],
    ['幻覚毒', 'na_09_chikage_o_p_2.png'],
    ['弛緩毒', 'na_09_chikage_o_p_3.png'],
    ['滅灯毒', 'na_09_chikage_o_p_4.png'],
    ['滅灯毒', 'na_09_chikage_o_p_4.png'],
    ['滅灯の魂毒', 'na_09_chikage_o_s_1.png'],
    ['叛旗の纏毒', 'na_09_chikage_o_s_2.png'],
    ['流転の霞毒', 'na_09_chikage_o_s_3.png'],
    ['残滓の絆毒', 'na_09_chikage_a1_s_4.png'],
  ],
  'クルル': [
    ['えれきてる', 'na_10_kururu_o_n_1.png'],
    ['あくせらー', 'na_10_kururu_o_n_2.png'],
    ['くるるーん', 'na_10_kururu_o_n_3.png'],
    ['とるねーど', 'na_10_kururu_o_n_4.png'],
    ['りげいなー', 'na_10_kururu_o_n_5.png'],
    ['もじゅるー', 'na_10_kururu_o_n_6.png'],
    ['りふれくた', 'na_10_kururu_o_n_7.png'],
    ['どれーんでびる', 'na_10_kururu_o_s_1.png'],
    // ['びっぐごーれむ', 'na_10_kururu_o_s_2.png'],
    ['びっぐごーれむ', 'na_10_kururu_o_s_2_s2.png'],
    ['いんだすとりあ', 'na_10_kururu_o_s_3_s5.png'],
    ['でゅーぷりぎあ', 'na_10_kururu_o_s_3_ex1.png'],
    ['でゅーぷりぎあ', 'na_10_kururu_o_s_3_ex1.png'],
    ['でゅーぷりぎあ', 'na_10_kururu_o_s_3_ex1.png'],
    ['神渉装置:枢式', 'na_10_kururu_o_s_4.png'],
  ],
  'クルル (A1)': [
    ['あならいず', 'na_10_kururu_a1_n_1.png'],
    ['あくせらー', 'na_10_kururu_o_n_2.png'],
    ['だうじんぐ', 'na_10_kururu_a1_n_3.png'],
    ['とるねーど', 'na_10_kururu_o_n_4.png'],
    ['りげいなー', 'na_10_kururu_o_n_5.png'],
    ['もじゅるー', 'na_10_kururu_o_n_6.png'],
    ['りふれくた', 'na_10_kururu_o_n_7.png'],
    ['どれーんでびる', 'na_10_kururu_o_s_1.png'],
    // ['びっぐごーれむ', 'na_10_kururu_o_s_2.png'],
    ['びっぐごーれむ', 'na_10_kururu_o_s_2_s2.png'],
    ['らすとりさーち', 'na_10_kururu_a1_s_3.png'],
    ['ぐらんがりばー', 'na_10_kururu_a1_s_3_ex1.png'],
    ['神渉装置:枢式', 'na_10_kururu_o_s_4.png'],
  ],
  'サリヤ': [
    ['Burning Steam', 'na_11_thallya_o_n_1.png'],
    ['Waving Edge', 'na_11_thallya_o_n_2.png'],
    ['Shield Charge', 'na_11_thallya_o_n_3.png'],
    ['Steam Cannon', 'na_11_thallya_o_n_4.png'],
    ['Stunt', 'na_11_thallya_o_n_5.png'],
    ['Roaring', 'na_11_thallya_o_n_6.png'],
    ['Turbo Switch', 'na_11_thallya_o_n_7.png'],
    ['Alpha-Edge', 'na_11_thallya_o_s_1.png'],
    ['Omega-Burst', 'na_11_thallya_o_s_2.png'],
    // ['Thallya\'s Masterpiece', 'na_11_thallya_o_s_3.png'],
    ['Thallya\'s Masterpiece', 'na_11_thallya_o_s_3_s3.png'],
    // ['Julia\'s BlackBox', 'na_11_thallya_o_s_4.png'],
    ['Julia\'s BlackBox', 'na_11_thallya_o_s_4_s3.png'],
    // ['Form: YAKSHA', 'na_11_thallya_o_tf_1.png'],
    ['Form: YAKSHA', 'na_11_thallya_o_tf_1_s2.png'],
    ['Form: NAGA', 'na_11_thallya_o_tf_2.png'],
    ['Form: GARUDA', 'na_11_thallya_o_tf_3.png'],
  ],
  'サリヤ (A1)': [
    ['Burning Steam', 'na_11_thallya_o_n_1.png'],
    ['Waving Edge', 'na_11_thallya_o_n_2.png'],
    ['Shield Charge', 'na_11_thallya_o_n_3.png'],
    ['Steam Cannon', 'na_11_thallya_o_n_4.png'],
    ['Quick Change', 'na_11_thallya_a1_n_5.png'],
    ['Roaring', 'na_11_thallya_o_n_6.png'],
    ['Turbo Switch', 'na_11_thallya_o_n_7.png'],
    ['BlackBox NEO', 'na_11_thallya_a1_s_1.png'],
    ['OMNIS-Blaster', 'na_11_thallya_a1_s_2.png'],
    // ['Thallya\'s Masterpiece', 'na_11_thallya_o_s_3.png'],
    ['Thallya\'s Masterpiece', 'na_11_thallya_o_s_3_s3.png'],
    // ['Julia\'s BlackBox', 'na_11_thallya_o_s_4.png'],
    ['Julia\'s BlackBox', 'na_11_thallya_o_s_4_s3.png'],
    ['Form: KINNARI', 'na_11_thallya_a1_tf_1.png'],
    ['Form: NAGA', 'na_11_thallya_o_tf_2.png'],
    // ['Form: ASURA', 'na_11_thallya_a1_tf_3.png'],
    ['Form: ASURA', 'na_11_thallya_a1_tf_3_s6.png'],
    ['Form: DEVA', 'na_11_thallya_a1_tf_4.png'],
  ],
  'ライラ': [
    // ['獣爪', 'na_12_raira_o_n_1.png'],
    ['獣爪', 'na_12_raira_o_n_1_s2.png'],
    ['風雷撃', 'na_12_raira_o_n_2.png'],
    ['流転爪', 'na_12_raira_o_n_3.png'],
    ['風走り', 'na_12_raira_o_n_4.png'],
    ['風雷の知恵', 'na_12_raira_o_n_5.png'],
    ['呼び声', 'na_12_raira_o_n_6.png'],
    ['空駆け', 'na_12_raira_o_n_7.png'],
    ['雷螺風神爪', 'na_12_raira_o_s_1.png'],
    ['天雷召喚陣', 'na_12_raira_o_s_2.png'],
    // ['風魔招来孔', 'na_12_raira_o_s_3.png'],
    ['風魔招来孔', 'na_12_raira_o_s_3_s4.png'],
    ['風魔旋風', 'na_12_raira_o_s_3_ex1.png'],
    ['風魔纏廻', 'na_12_raira_o_s_3_ex2.png'],
    ['風魔天狗道', 'na_12_raira_o_s_3_ex3.png'],
    // ['円環輪廻旋', 'na_12_raira_o_s_4.png'],
    ['円環輪廻旋', 'na_12_raira_o_s_4_s5.png'],
  ],
  'ライラ (A1)': [
    // ['獣爪', 'na_12_raira_o_n_1.png'],
    ['獣爪', 'na_12_raira_o_n_1_s2.png'],
    // ['暴風', 'na_12_raira_a1_n_2.png'],
    ['暴風', 'na_12_raira_a1_n_2_s6.png'],
    ['流転爪', 'na_12_raira_o_n_3.png'],
    ['風走り', 'na_12_raira_o_n_4.png'],
    ['風雷の知恵', 'na_12_raira_o_n_5.png'],
    ['大嵐', 'na_12_raira_a1_n_6.png'],
    ['空駆け', 'na_12_raira_o_n_7.png'],
    ['雷螺風神爪', 'na_12_raira_o_s_1.png'],
    ['天雷召喚陣', 'na_12_raira_o_s_2.png'],
    ['陣風祭天儀', 'na_12_raira_a1_s_3.png'],
    ['風魔旋風', 'na_12_raira_o_s_3_ex1.png'],
    ['風魔纏廻', 'na_12_raira_o_s_3_ex2.png'],
    ['風魔天狗道', 'na_12_raira_o_s_3_ex3.png'],
    // ['円環輪廻旋', 'na_12_raira_o_s_4.png'],
    ['円環輪廻旋', 'na_12_raira_o_s_4_s5.png'],
    // ['嵐の力', 'na_12_raira_a1_st.png'],
    ['嵐の力', 'na_12_raira_a1_st_s6.png'],
  ],
  'ウツロ': [
    ['円月', 'na_13_utsuro_o_n_1.png'],
    ['黒き波動', 'na_13_utsuro_o_n_2.png'],
    ['刈取り', 'na_13_utsuro_o_n_3.png'],
    ['重圧', 'na_13_utsuro_o_n_4.png'],
    ['影の翅', 'na_13_utsuro_o_n_5.png'],
    ['影の壁', 'na_13_utsuro_o_n_6.png'],
    ['遺灰呪', 'na_13_utsuro_o_n_7.png'],
    ['灰滅', 'na_13_utsuro_o_s_1.png'],
    ['虚偽', 'na_13_utsuro_o_s_2.png'],
    ['終末', 'na_13_utsuro_o_s_3.png'],
    // ['魔食', 'na_13_utsuro_o_s_4.png'],
    ['魔食', 'na_13_utsuro_o_s_4_s5.png'],
  ],
  'ウツロ (A1)': [
    ['円月', 'na_13_utsuro_o_n_1.png'],
    ['蝕みの塵', 'na_13_utsuro_a1_n_2.png'],
    ['刈取り', 'na_13_utsuro_o_n_3.png'],
    ['重圧', 'na_13_utsuro_o_n_4.png'],
    ['影の翅', 'na_13_utsuro_o_n_5.png'],
    ['影の壁', 'na_13_utsuro_o_n_6.png'],
    ['遺灰呪', 'na_13_utsuro_o_n_7.png'],
    // ['残響装置:枢式', 'na_13_utsuro_a1_s_1.png'],
    ['残響装置:枢式', 'na_13_utsuro_a1_s_1_s4.png'],
    ['望我', 'na_13_utsuro_a1_s_1_ex1.png'],
    ['万象乖ク殲滅ノ影', 'na_13_utsuro_a1_s_1_ex2.png'],
    ['我ヲ亡クシテ静寂ヲ往ク', 'na_13_utsuro_a1_s_1_ex3.png'],
    ['終焉、来タレ', 'na_13_utsuro_a1_s_1_ex4.png'],
    ['虚偽', 'na_13_utsuro_o_s_2.png'],
    ['終末', 'na_13_utsuro_o_s_3.png'],
    // ['魔食', 'na_13_utsuro_o_s_4.png'],
    ['魔食', 'na_13_utsuro_o_s_4_s5.png'],
  ],
  'ホノカ': [
    ['精霊式', 'na_14_honoka_o_n_1.png'],
    ['守護霊式', 'na_14_honoka_o_n_1_ex1.png'],
    ['突撃霊式', 'na_14_honoka_o_n_1_ex2.png'],
    ['神霊ヲウカ', 'na_14_honoka_o_n_1_ex3.png'],
    // ['桜吹雪', 'na_14_honoka_o_n_2.png'],
    ['桜吹雪', 'na_14_honoka_o_n_2_s5.png'],
    ['義旗共振', 'na_14_honoka_o_n_3.png'],
    ['桜の翅', 'na_14_honoka_o_n_4.png'],
    ['再生', 'na_14_honoka_o_n_4_ex1.png'],
    ['桜花のお守り', 'na_14_honoka_o_n_5.png'],
    ['仄かなる輝き', 'na_14_honoka_o_n_5_ex1.png'],
    // ['微光結界', 'na_14_honoka_o_n_6.png'],
    ['指揮', 'na_14_honoka_o_n_6_s4.png'],
    ['追い風', 'na_14_honoka_o_n_7.png'],
    ['胸に想いを', 'na_14_honoka_o_s_1.png'],
    // ['≫ 両手に華を', 'na_14_honoka_o_s_1_ex1.png'],
    ['両手に華を', 'na_14_honoka_o_s_1_ex1_s5.png'],
    ['そして新たな幕開けを', 'na_14_honoka_o_s_1_ex2.png'],
    ['この旗の名の下に', 'na_14_honoka_o_s_2.png'],
    // ['四季はまた廻り来る', 'na_14_honoka_o_s_3.png'],
    ['四季はまた廻り来る', 'na_14_honoka_o_s_3_s4.png'],
    ['満天の花道で', 'na_14_honoka_o_s_4.png'],
  ],
  'ホノカ (A1)': [
    ['桜の双剣', 'na_14_honoka_a1_n_1.png'],
    ['影の両手', 'na_14_honoka_a1_n_1_ex1.png'],
    // ['桜吹雪', 'na_14_honoka_o_n_2.png'],
    ['桜吹雪', 'na_14_honoka_o_n_2_s5.png'],
    ['義旗共振', 'na_14_honoka_o_n_3.png'],
    ['桜の翅', 'na_14_honoka_o_n_4.png'],
    ['再生', 'na_14_honoka_o_n_4_ex1.png'],
    ['桜花のお守り', 'na_14_honoka_o_n_5.png'],
    ['仄かなる輝き', 'na_14_honoka_o_n_5_ex1.png'],
    // ['微光結界', 'na_14_honoka_o_n_6.png'],
    ['指揮', 'na_14_honoka_o_n_6_s4.png'],
    ['追い風', 'na_14_honoka_o_n_7.png'],
    ['ひとり目覚めて', 'na_14_honoka_a1_s_1.png'],
    ['標をたどり', 'na_14_honoka_a1_s_1_ex1.png'],
    ['影面見向き', 'na_14_honoka_a1_s_1_ex2.png'],
    ['桜花眩く輝かん', 'na_14_honoka_a1_s_1_ex3.png'],
    ['ふたり震える手を取ろう', 'na_14_honoka_a1_s_1_ex4.png'],
    ['旧き虚路を歩みゆく', 'na_14_honoka_a1_s_1_ex5.png'],
    ['この旗の名の下に', 'na_14_honoka_o_s_2.png'],
    // ['四季はまた廻り来る', 'na_14_honoka_o_s_3.png'],
    ['四季はまた廻り来る', 'na_14_honoka_o_s_3_s4.png'],
    ['満天の花道で', 'na_14_honoka_o_s_4.png'],
  ],
  'コルヌ': [
    ['雪刃', 'na_15_korunu_o_n_1.png'],
    ['旋回刃', 'na_15_korunu_o_n_2.png'],
    ['剣の舞', 'na_15_korunu_o_n_3.png'],
    ['雪渡り', 'na_15_korunu_o_n_4.png'],
    ['絶対零度', 'na_15_korunu_o_n_5.png'],
    ['かじかみ', 'na_15_korunu_o_n_6.png'],
    // ['氷縛場', 'na_15_korunu_o_n_7.png'],
    ['霜の茨', 'na_15_korunu_o_n_7_s6.png'],
    ['コンルルヤンペ', 'na_15_korunu_o_s_1.png'],
    ['レタルレラ', 'na_15_korunu_o_s_2.png'],
    ['ウパシトゥム', 'na_15_korunu_o_s_3.png'],
    // ['ポルチャルトー', 'na_15_korunu_o_s_4.png'],
    ['ポルチャルトー', 'na_15_korunu_o_s_4_s6.png'],
  ],
  'ヤツハ': [
    // ['星の爪', 'na_16_yatsuha_o_n_1.png'],
    ['星の爪', 'na_16_yatsuha_o_n_1_s5.png'],
    // ['昏い咢', 'na_16_yatsuha_o_n_2.png'],
    ['昏い咢', 'na_16_yatsuha_o_n_2_s5.png'],
    ['鏡の悪魔', 'na_16_yatsuha_o_n_3.png'],
    ['幻影歩法', 'na_16_yatsuha_o_n_4.png'],
    ['意志', 'na_16_yatsuha_o_n_5.png'],
    ['契約', 'na_16_yatsuha_o_n_6.png'],
    ['寄花', 'na_16_yatsuha_o_n_7.png'],
    ['双葉鏡の祟り神', 'na_16_yatsuha_o_s_1.png'],
    ['四葉鏡のわらべ唄', 'na_16_yatsuha_o_s_2.png'],
    ['六葉鏡の星の海', 'na_16_yatsuha_o_s_3.png'],
    ['八葉鏡の向こう側', 'na_16_yatsuha_o_s_4.png'],
  ],
  'ハツミ': [
    ['水雷球', 'na_17_hatsumi_o_n_1.png'],
    ['水流', 'na_17_hatsumi_o_n_2.png'],
    ['強酸', 'na_17_hatsumi_o_n_3.png'],
    ['海嘯', 'na_17_hatsumi_o_n_4.png'],
    ['準備万端', 'na_17_hatsumi_o_n_5.png'],
    ['羅針盤', 'na_17_hatsumi_o_n_6.png'],
    ['波呼び', 'na_17_hatsumi_o_n_7.png'],
    ['イサナ海域', 'na_17_hatsumi_o_s_1.png'],
    ['オヨギビ砲火', 'na_17_hatsumi_o_s_2.png'],
    ['カラハリ灯台', 'na_17_hatsumi_o_s_3.png'],
    ['ミオビキ航路', 'na_17_hatsumi_o_s_4.png'],
  ],
  'ミズキ': [
    ['陣頭', 'na_18_mizuki_o_n_1.png'],
    // ['反攻', 'na_18_mizuki_o_n_2.png'],
    ['反攻', 'na_18_mizuki_o_n_2_s6.png'],
    ['撃ち落とし', 'na_18_mizuki_o_n_3.png'],
    ['号令', 'na_18_mizuki_o_n_4.png'],
    ['防壁', 'na_18_mizuki_o_n_5.png'],
    // ['制圧前進', 'na_18_mizuki_o_n_6.png'],
    ['制圧前進', 'na_18_mizuki_o_n_6_s6.png'],
    ['戦場', 'na_18_mizuki_o_n_7.png'],
    ['天主八龍閣', 'na_18_mizuki_o_s_1.png'],
    ['三重膝丸櫓', 'na_18_mizuki_o_s_2.png'],
    ['大手楯無門', 'na_18_mizuki_o_s_3.png'],
    ['闘神', 'na_18_mizuki_o_s_3_ex1.png'],
    ['山城水津城の鬨の声', 'na_18_mizuki_o_s_4.png'],
    ['槍兵', 'na_18_mizuki_o_t_1.png'],
    ['槍兵', 'na_18_mizuki_o_t_1.png'],
    ['盾兵', 'na_18_mizuki_o_t_2.png'],
    ['騎兵', 'na_18_mizuki_o_t_3.png'],
  ],
  'メグミ': [
    ['空閃', 'na_19_megumi_o_n_1.png'],
    ['打擲', 'na_19_megumi_o_n_2.png'],
    ['殻打ち', 'na_19_megumi_o_n_3.png'],
    ['棹穿ち', 'na_19_megumi_o_n_4.png'],
    ['葦', 'na_19_megumi_o_n_5.png'],
    ['鳳仙花', 'na_19_megumi_o_n_6.png'],
    ['野茨', 'na_19_megumi_o_n_7.png'],
    ['因果律の根', 'na_19_megumi_o_s_1.png'],
    ['可能性の枝', 'na_19_megumi_o_s_2.png'],
    ['結末の果実', 'na_19_megumi_o_s_3.png'],
    ['瀧河希の掌', 'na_19_megumi_o_s_4.png'],
  ],
  'カナエ': [
    ['空想', 'na_20_kanawe_o_n_1.png'],
    ['脚本家', 'na_20_kanawe_o_n_2.png'],
    ['演出家', 'na_20_kanawe_o_n_3.png'],
    ['断行', 'na_20_kanawe_o_n_4.png'],
    ['残光', 'na_20_kanawe_o_n_5.png'],
    ['即興', 'na_20_kanawe_o_n_6.png'],
    ['封殺', 'na_20_kanawe_o_n_7.png'],
    ['たまゆらふみ', 'na_20_kanawe_o_s_1.png'],
    ['ほかげきらぼし', 'na_20_kanawe_o_s_2.png'],
    ['あたらよちよに', 'na_20_kanawe_o_s_3.png'],
    ['はらからのあまつそら', 'na_20_kanawe_o_s_4.png'],
    ['殺陣', 'na_20_kanawe_o_p_1.png'],
    ['桜飛沫', 'na_20_kanawe_o_p_2.png'],
    ['鼓動', 'na_20_kanawe_o_p_3.png'],
    ['明転', 'na_20_kanawe_o_p_4.png'],
    ['粒立て', 'na_20_kanawe_o_p_5.png'],
    ['位置取り', 'na_20_kanawe_o_p_6.png'],
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
  'シンラ (A1)': [
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
  'サリヤ (A1)': [
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
  'ライラ (A1)': [
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
    card.upright();
    SoundEffect.play(PresetSound.cardDraw);
  }

  private getCardBack(filename: string): string {
    const backNormal = 'cardback_normal.png';
    let back: string;

    switch (filename) {
      case 'na_08_hagane_a1_s_1_ex1.png': back = backNormal; break;
      case 'na_10_kururu_o_s_3_ex1.png': back = backNormal; break;
      case 'na_12_raira_a1_st_s6.png': back = 'na_12_raira_a1_st_s6.png'; break;
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
      switch (filename.match(/^na_\d{2}_[a-z]+_(?:o|a\d)_(n|p|s|tf|t)/)[1]) {
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
    MEGAMI_CARDS[name].forEach(([cardName, filename]) => {
      const path = `./assets/furuyoni_commons_na/furuyoni_na/cards/${filename}`;
      if (!this.fileStorageService.get(path)) {
        this.fileStorageService.add(path);
      }
      let card = Card.create(cardName, path, this.getCardBack(filename));
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
