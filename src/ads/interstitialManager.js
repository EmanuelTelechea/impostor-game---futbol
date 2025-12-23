import {
    AdEventType,
    InterstitialAd,
    TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-3581337061010191~7236708130"; // TU ID REAL

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

let loaded = false;

export const initInterstitial = () => {
  interstitial.load();
};

export const showInterstitial = async () => {
  if (!loaded) return;
  await interstitial.show();
};

interstitial.addAdEventListener(AdEventType.LOADED, () => {
  loaded = true;
});

interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  loaded = false;
  interstitial.load(); // precargar el siguiente
});
