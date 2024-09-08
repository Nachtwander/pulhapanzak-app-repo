import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ceutec.pulhapanzakapp',
  appName: 'pulhapanzak-app',
  webDir: 'www',
  server:{
    androidScheme: 'https'
  }
};

export default config;
