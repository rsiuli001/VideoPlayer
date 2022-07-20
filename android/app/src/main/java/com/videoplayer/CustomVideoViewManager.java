package com.videoplayer;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class CustomVideoViewManager extends SimpleViewManager<CustomVideoLayout> {

    private static final String REACT_CLASS = "RCTLeviCustomVideoView";

    public static final String PROP_SRC = "src";
    public static final String PROP_SRC_URI = "uri";
    public static final String PROP_REPEAT = "repeat";
    public static final String PROP_PAUSED = "paused";
    public static final String PROP_HEIGHT = "height";
    public static final String PROP_WIDTH = "width";
    public static final String PROP_MUTED = "muted";
    public static final String PROP_DISPLAY_MODE = "displayMode";
    public static final String PROP_POSTER_RESIZE = "posterImageResizeMode";
    public static final String PROP_POSTER_URI = "posterImageUri";
    public static final String PROP_ENABLE_CONTROLS = "enableVideoControls";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected CustomVideoLayout createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new CustomVideoLayout(reactContext, reactContext.getCurrentActivity());
    }

    @ReactProp(name = PROP_SRC)
    public void setSrc(final CustomVideoLayout videoLayout, @Nullable ReadableMap src) {
        videoLayout.setSource(src.getString(PROP_SRC_URI));
    }

    @ReactProp(name = PROP_REPEAT, defaultBoolean = false)
    public void setRepeat(final CustomVideoLayout videoLayout, final boolean repeat) {
        videoLayout.setRepeatModifier(repeat);
    }

    @ReactProp(name = PROP_PAUSED, defaultBoolean = false)
    public void setPaused(final CustomVideoLayout videoLayout, final boolean paused) {
        videoLayout.setPausedModifier(paused);
    }

    @ReactProp(name = PROP_MUTED, defaultBoolean = false)
    public void setMuted(final CustomVideoLayout videoLayout, final boolean muted) {
        videoLayout.setMutedModifier(muted);
    }

    @ReactProp(name = PROP_DISPLAY_MODE)
    public void setDisplayMode(final CustomVideoLayout videoLayout, final String displayMode) {
        videoLayout.setDisplayMode(displayMode);
    }

    @ReactProp(name = PROP_POSTER_URI)
    public void setPosterImageUri(final CustomVideoLayout videoLayout, @Nullable ReadableMap src) {
        videoLayout.setPosterImageSource(src.getString(PROP_SRC_URI));
    }

    @ReactProp(name = PROP_POSTER_RESIZE)
    public void setPosterImageResizeMode(final CustomVideoLayout videoLayout, final String posterResizeMode) {
        videoLayout.setPosterImageResizeMode(posterResizeMode);
    }

    @ReactProp(name = PROP_ENABLE_CONTROLS, defaultBoolean = true)
    public void setEnableControls(final CustomVideoLayout videoLayout, final boolean enableVideoControls) {
        videoLayout.setEnableControls(enableVideoControls);
    }

    @ReactProp(name = PROP_HEIGHT, defaultFloat = 0f)
    public void setVideoHeight(final CustomVideoLayout videoLayout, float height) {
        Log.d("@@@", "setVideoHeight: " + height);
    }

    @ReactProp(name = PROP_WIDTH, defaultFloat = 0f)
    public void setVideoWidth(final CustomVideoLayout videoLayout, float width) {
        Log.d("@@@", "setVideoWidth: " + width);
    }
}
