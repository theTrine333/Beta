import React, { createContext, useEffect, useState } from "react";
import {
  InterstitialAd,
  RewardedInterstitialAd,
  AdEventType,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import * as Contstants from "expo-constants";

export const AdContext = createContext();

const interstitialAdUnitId =
  Contstants.default.expoConfig.extra?.admob?.interstialId;
const rewardedInterstitialAdUnitId =
  Contstants.default.expoConfig.extra?.admob?.interstialRewardID;

export const AdProvider = ({ children }) => {
  const [interstitialAd, setInterstitialAd] = useState(null);
  const [rewardedInterstitialAd, setRewardedInterstitialAd] = useState(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);

  useEffect(() => {
    // Create Interstitial Ad
    const interstitial = InterstitialAd.createForAdRequest(
      interstitialAdUnitId,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    );

    // Create Rewarded Interstitial Ad
    const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
      rewardedInterstitialAdUnitId,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    );

    // Load Interstitial Ad
    const loadInterstitialAd = () => interstitial.load();
    const loadRewardedAd = () => rewardedInterstitial.load();

    // Interstitial Ad event listeners
    interstitial.addAdEventListener(AdEventType.LOADED, () =>
      setInterstitialLoaded(true)
    );
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialLoaded(false);
      loadInterstitialAd(); // Load next interstitial ad
    });
    interstitial.addAdEventListener(AdEventType.ERROR, () => {
      console.log("Interstitial Ad failed to load. Retrying...");
      setTimeout(loadInterstitialAd, 5000); // Retry after 5 seconds
    });

    // Rewarded Interstitial Ad event listeners
    rewardedInterstitial.addAdEventListener(RewardedAdEventType.LOADED, () =>
      setRewardedLoaded(true)
    );
    rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setRewardedLoaded(false);
      loadRewardedAd(); // Load next rewarded interstitial ad
    });
    rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log("User earned reward:", reward);
      }
    );
    rewardedInterstitial.addAdEventListener(AdEventType.ERROR, () => {
      console.log("Rewarded Interstitial Ad failed to load. Retrying...");
      setTimeout(loadRewardedAd, 5000); // Retry after 5 seconds
    });

    setInterstitialAd(interstitial);
    setRewardedInterstitialAd(rewardedInterstitial);
    loadInterstitialAd();
    loadRewardedAd();

    // Show interstitial ad every 5 minutes
    const interstitialInterval = setInterval(() => {
      if (interstitialLoaded) {
        interstitial.show();
      }
    }, 3 * 60 * 1000); // 5 minutes

    // Show rewarded interstitial ad every 10 minutes
    const rewardedInterval = setInterval(() => {
      if (rewardedLoaded) {
        rewardedInterstitial.show();
      }
    }, 7 * 60 * 1000); // 10 minutes

    return () => {
      clearInterval(interstitialInterval);
      clearInterval(rewardedInterval);
    };
  }, [interstitialLoaded, rewardedLoaded]);

  return <AdContext.Provider value={{}}>{children}</AdContext.Provider>;
};
