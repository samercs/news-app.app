// Angular references
import { OpaqueToken } from '@angular/core';

// Token used to inject the configuration object
export let TOKEN_CONFIG = new OpaqueToken('app.config');

export interface AppConfig {

    // Application name
    appName: string;

    // Application mode
    // When testMode is set to true, the HttpClient won't be called, and mocks will
    // be returned instead. This mode can be used to develop/show the app when the 
    // required api endpoints are not yet ready
    testMode: boolean;

    // Localization
    defaultLanguage: string;
    availableLanguages: Array<string>;

    // HTTP Client
    timeout: number;
    apiKey: string;

    apiUrlLocal: string;
    apiUrlStaging: string;
    apiUrlProduction: string;
    tokenApiUrl: string;
}

// Application Config object
export const APP_CONFIG: AppConfig = {

    // Application name
    appName: 'NewsApp',

    // Application mode
    testMode: true,

    // Localization
    defaultLanguage:    'ar',
    availableLanguages: ['en', 'ar'],

    // HTTP Client
    timeout:    50000,
    apiKey:     'UY0l7NgHenpPInEGxOKH',

    apiUrlLocal:        'http://localhost:2240/api',
    apiUrlStaging:      'http://localhost:62506/api',
    apiUrlProduction:   'http://localhost:62506/api',
    tokenApiUrl: 'http://localhost:2240/api/token'

};