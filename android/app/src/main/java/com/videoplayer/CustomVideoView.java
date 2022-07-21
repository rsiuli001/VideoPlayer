package com.videoplayer;

import android.content.Context;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.util.AttributeSet;
import android.util.Log;
import android.widget.RelativeLayout;
import android.widget.VideoView;
import java.util.HashMap;

public class CustomVideoView extends VideoView {
    private int mVideoWidth;
    private int mVideoHeight;
    private boolean mPaused;

    public enum DisplayMode {
        contain,       // original aspect ratio
        cover,
        none,
        stretch
    }

    private DisplayMode displayMode = DisplayMode.contain;

    public CustomVideoView(Context context) {
        super(context);
    }

    public CustomVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public CustomVideoView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setVideoSize(int width, int height) {
        mVideoWidth = width;
        mVideoHeight = height;
    }

    public void resizeVideo() {
        requestLayout();
        invalidate();
    }

    public void setDisplayMode(DisplayMode mode) {
        displayMode = mode;
    }

    public void setPausedModifier(boolean paused) {
        mPaused = paused;
        if (mPaused) {
            super.pause();
        } else {
            super.start();
        }
    }

    @Override
    public void setVideoURI(Uri uri) {
        try {
            MediaMetadataRetriever retriever = new MediaMetadataRetriever();
            Bitmap bmp = null;
            retriever.setDataSource(String.valueOf(uri), new HashMap<String, String>());
            bmp = retriever.getFrameAtTime();
            mVideoHeight = bmp.getHeight();
            mVideoWidth = bmp.getWidth();
        } catch (Exception e) {
            e.printStackTrace();
        }
        super.setVideoURI(uri);
    }

    @Override
    public void onMeasure(final int widthMeasureSpec, final int heightMeasureSpec) {
        int containerWidth = getDefaultSize(0, widthMeasureSpec);
        int containerHeight = getDefaultSize(0, heightMeasureSpec);

        int width = containerWidth;
        int height = containerHeight;

        Log.d("@@@", "onMeasure: mVideoWidth: " + mVideoWidth);
        Log.d("@@@", "onMeasure: mVideoHeight: " + mVideoHeight);
        Log.d("@@@", "onMeasure: containerWidth: " + containerWidth);
        Log.d("@@@", "onMeasure: containerHeight: " + containerHeight);
        Log.d("@@@", "onMeasure: width: " + width);
        Log.d("@@@", "onMeasure: height: " + height);

        float videoAspectRatio = (float) mVideoWidth / mVideoHeight;
        Log.d("@@@", "onMeasure: videoAspectRatio: " + videoAspectRatio);

        if (displayMode == DisplayMode.contain) {
            if (mVideoWidth > 0 && mVideoHeight > 0) {
                if (mVideoWidth * height > width * mVideoHeight) {
                    height = width * mVideoHeight / mVideoWidth;
                } else if (mVideoWidth * height < width * mVideoHeight) {
                    width = height * mVideoWidth / mVideoHeight;
                } else {
                    // aspect ratio is correct
                }
            }
        } else if (displayMode == DisplayMode.none) {
            // just use the default screen width and screen height
            if (mVideoWidth > 0 && mVideoHeight > 0) {
                height = mVideoHeight;
                width = mVideoWidth;
            }
        } else if (displayMode == DisplayMode.cover) {
            // zoom video
            if (mVideoWidth > 0 && mVideoHeight > 0 ) {
                if(containerWidth > containerHeight) {
                    height = (int) (containerWidth * videoAspectRatio);
                } else {
                    width = (int) (containerHeight * videoAspectRatio);
                }
            }
        }
        Log.d("@@@", "onMeasure: mVideoWidth2: " + mVideoWidth);
        Log.d("@@@", "onMeasure: mVideoHeight2: " + mVideoHeight);
        Log.d("@@@", "onMeasure: containerWidth2: " + containerWidth);
        Log.d("@@@", "onMeasure: containerHeight2: " + containerHeight);
        Log.d("@@@", "onMeasure: width2: " + width);
        Log.d("@@@", "onMeasure: height2: " + height);
        setMeasuredDimension(width, height);
    }
}


