package com.rnwechat;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import dk.madslee.imageSequence.RCTImageSequencePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import io.jchat.android.JMessageReactPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.remobile.toast.RCTToastPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSoundPackage(),
            new RCTImageSequencePackage(),
            new LinearGradientPackage(),
            new JMessageReactPackage(!BuildConfig.DEBUG),
            new PickerPackage(),
            new RNGestureHandlerPackage(),
            new RCTToastPackage(),
            new SQLitePluginPackage(),
              new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
