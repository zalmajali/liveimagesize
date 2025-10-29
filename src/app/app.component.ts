import { Component } from '@angular/core';
import { AlertController, Platform, NavController, MenuController, ToastController } from '@ionic/angular';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from "./service/database.service";
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { HttpClient } from '@angular/common/http';
import { ChatService } from "./service/chat.service";
import * as CryptoJS from 'crypto-js';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public menuDirection: any;
  public checkLanguage: any = 0;
  public language: any;
  public mainUserName: any;
  public userName: any;
  public password: any;
  public apiKey: any;
  public apiKeyNew: any;
  public sessionLogin: any;
  public dir: any;
  public genaratedFullDate: any;
  public genaratedDate: any;
  public year: any;
  public month: any;
  public day: any;
  public hour: any;
  public minutes: any;
  public seconds: any;
  public returnResultData: any;
  public returnChatArray: any = [];
  public returnArrayChatFromServer: any = [];
  public pushMessage: any;
  public newPushMessage: any;
  public returnResultDataBySession: any;
  public returnArrayChatSessionFromServer: any;

  constructor(
    private chatService: ChatService,
    private http: HttpClient,
    private statusBar: StatusBar,
    private databaseService: DatabaseService,
    private globalization: Globalization,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private menu: MenuController,
    private alertController: AlertController,
    private platform: Platform,
    private storage: Storage,
    private androidPermissions: AndroidPermissions
  ) {
    this.goPageValue();
    this.platform.ready().then(async () => {
      setTimeout(async () => {
        try {
          await this.statusBar.overlaysWebView(false);
          await this.statusBar.backgroundColorByHexString('#FF7901');
          await this.statusBar.styleLightContent();
        } catch (error) { }
      }, 2500);
    });
  }
  async initialiseTranslation() {
    await this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    await this.translate.get('dir').subscribe((res: string) => {
      this.dir = res;
    });
    await this.translate.get('pushMessage').subscribe((res: string) => {
      this.pushMessage = res;
    });
    await this.translate.get('newPushMessage').subscribe((res: string) => {
      this.newPushMessage = res;
    });
  }
  async goPageValue() {
    await this.statusBar.overlaysWebView(false);
    await this.statusBar.backgroundColorByHexString('#FF7901');
    await this.statusBar.styleLightContent();
    await this.storage.create();
    await this.getDeviceLanguage();
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
    if (this.mainUserName == null || this.userName == null || this.password == null || this.apiKey == null || this.sessionLogin == null)
      this.navCtrl.navigateRoot('login');
    else
      this.navCtrl.navigateRoot('home');
  }

  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async (checkLanguage: any) => {
      this.checkLanguage = checkLanguage
    });
    if (this.checkLanguage) {
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      await this.initialiseTranslation();
    } else {
      if (window.Intl && typeof window.Intl === 'object') {
        let Val = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        this.language = (Val[0] == "ar" || Val[0] == "en") ? Val[0] : 'en';
        this.translate.use(this.language);
        await this.initialiseTranslation();
      } else {
        this.globalization.getPreferredLanguage().then(async res => {
          let Val = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          this.language = (Val[0] == "ar" || Val[0] == "en") ? Val[0] : 'en';
          this.translate.use(this.language);
          await this.initialiseTranslation();
        }).catch(e => { console.log(e); });
      }
    }
  }
}
