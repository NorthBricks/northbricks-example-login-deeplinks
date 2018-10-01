import { Component, OnInit } from '@angular/core';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  redirectUrl = 'https://localhost';
  public options: InAppBrowserOptions = {
    location: 'yes', // Or 'no'
    hidden: 'no', // Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes', // Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', // Android only
    closebuttoncaption: 'Close', // iOS only
    disallowoverscroll: 'no', // iOS only
    toolbar: 'yes', // iOS only
    enableViewportScale: 'no', // iOS only
    allowInlineMediaPlayback: 'no', // iOS only
    presentationstyle: 'pagesheet', // iOS only
    fullscreen: 'yes' // Windows only
  };
  constructor(private safariViewController: SafariViewController, private iab: InAppBrowser) { }

  ngOnInit() {
  }


  signup() {
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {

          this.safariViewController.show({
            url: 'https://api.northbricks.io/signup',
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          })
            .subscribe((result: any) => {
              if (result.event === 'opened') {
                console.log('Opened');
              } else if (result.event === 'loaded') {
                console.log('Loaded');
              } else if (result.event === 'closed') {
                console.log('Closed');
              }
            },
              (error: any) => console.error(error)
            );

        } else {
          // use fallback browser, example InAppBrowser
        }
      }
      );
  }
  bankAuthClick() {
    this.bankAuth().then(() => {
      alert('Done');
    });
  }
  bankAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      const browser = this.iab.create('https://api.northbricks.io/api/v1/me/banks/5676709948948480/auth?access_token=aa8f435a-cc41-4630-8bc9-902998bb1cf6');

      browser.on('loadstart').subscribe((event) => {
        console.log('loadstart');
        console.log(JSON.stringify(event));
        console.log(event.url);
        if ((event.url).indexOf(`https://api.northbricks.io/signup-success`) === 0) {
          console.log('Fick tillbaka loadstart - redirect url');
          browser.close();
          console.log(event.url);
        } else if ((event.url).indexOf(`https://api.northbricks.io/login-error`) === 0) {
          console.log('Here we can count logon errors');
        }
      });
      browser.on('loadstop').subscribe(event => {

      });

      browser.close();
    });

  }

  public loginNorthbricks(): Promise<OAuthResponse> {

    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      const oAuthUrl = `https://api.northbricks.io/oauth/authorize?client_id=sampleClientId&redirect_uri=${this.redirectUrl}&scope=read&response_type=token`;

      const browser = this.iab.create(oAuthUrl, '_blank', this.options);




      browser.on('loadstart').subscribe((event) => {
        console.log('loadstart ' + event.url);

        if ((event.url).indexOf(`${this.redirectUrl}`) === 0) {
          console.log('Fick tillbaka loadstart - redirect url');
          console.log('URL:: ' + event.url);
          const responseParameters = ((event.url).split('#')[1]).split('&');
          console.log(responseParameters);
          const parsedResponse = {};
          console.log('RESPONSE::: ' + responseParameters);
          for (let i = 0; i < responseParameters.length; i++) {
            parsedResponse[responseParameters[i].split('=')[0]] = responseParameters[i].split('=')[1];
          }
          console.log('PARSED RESPONSE ' + JSON.stringify(parsedResponse));
          if (parsedResponse['access_token'] !== undefined && parsedResponse['access_token'] !== null) {
            console.log('Access token..');
            browser.close();
            resolve(<OAuthResponse>parsedResponse);
          } else {
            console.log('Problem authenticating with Northbricks');
            reject(new Error('Problem authenticating with Northbricks'));
          }
        } else if ((event.url).indexOf(`https://api.northbricks.io/login-error`) === 0) {
          console.log('Here we can count logon errors');
        }
      });
    });



  }


  login() {
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {

          this.safariViewController.show({
            url: 'https://api.northbricks.io/signup',
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          })
            .subscribe((result: any) => {
              if (result.event === 'opened') {
                console.log('Opened');
              } else if (result.event === 'loaded') {
                console.log('Loaded');
              } else if (result.event === 'closed') {
                console.log('Closed');
              }
            },
              (error: any) => console.error(error)
            );

        } else {
          // use fallback browser, example InAppBrowser
        }
      }
      );
  }
}

export interface OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}
