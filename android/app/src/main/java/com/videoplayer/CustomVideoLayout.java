package com.videoplayer;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.media.MediaPlayer;
import android.net.Uri;
import android.view.MotionEvent;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;

import androidx.annotation.NonNull;

import com.bumptech.glide.Glide;
import com.facebook.react.uimanager.ThemedReactContext;

public class CustomVideoLayout extends FrameLayout {
    private ThemedReactContext mThemedReactContext;
    private FrameLayout screenLayout;
    private CustomVideoView videoView;
    private ImageView imageView;
    private ImageButton playPauseButton;
    private ImageButton muteButton;
    private boolean mMuted;
    private boolean mRepeat;
    private boolean mEnableControls;
    private MediaPlayer mediaPlayer;

    public CustomVideoLayout(@NonNull ThemedReactContext context, Activity activity) {
        super(context);
        mThemedReactContext = context;
        screenLayout = (FrameLayout) activity.getLayoutInflater().inflate(R.layout.levi_custom_video_view, null);

        this.addView(screenLayout);
        imageView = findViewById(R.id.posterImage);
        videoView = findViewById(R.id.leviCustomVideoView);
        videoView.setOnPreparedListener(preparedListener);
        videoView.setOnTouchListener(videoViewOnTouchListener);
        videoView.setOnCompletionListener(videoOnCompleteHandler);

        playPauseButton = findViewById(R.id.pause_play_button);
        playPauseButton.setOnClickListener(onClickListener);

        muteButton = findViewById(R.id.volume_button);
        muteButton.setOnClickListener(onClickListener);
    }

    MediaPlayer.OnPreparedListener preparedListener = new MediaPlayer.OnPreparedListener() {
        @Override
        public void onPrepared(MediaPlayer mp) {
            mediaPlayer = mp;
            imageView.setVisibility(View.GONE);
            if(mMuted) {
                mute();
            }
        }
    };

    MediaPlayer.OnCompletionListener videoOnCompleteHandler = new MediaPlayer.OnCompletionListener() {
        @Override
        public void onCompletion(MediaPlayer mp) {
            if(mRepeat) {
                videoView.start();
            }
        }
    };

    View.OnTouchListener videoViewOnTouchListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            if(mEnableControls) {
                playPauseButton.setVisibility(View.VISIBLE);
                playPauseButton.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        playPauseButton.setVisibility(View.INVISIBLE);
                    }
                }, 2000);

                muteButton.setVisibility(View.VISIBLE);
                muteButton.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        muteButton.setVisibility(View.INVISIBLE);
                    }
                }, 2000);
            }
            return false;
        }
    };

    View.OnClickListener onClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            switch (v.getId()) {
                case R.id.pause_play_button:
                    if(videoView.isPlaying()) {
                        playPauseButton.setBackgroundResource(R.drawable.play);
                        videoView.setPausedModifier(true);
                    } else {
                        playPauseButton.setBackgroundResource(R.drawable.pause);
                        videoView.setPausedModifier(false);
                    }
                    break;
                case R.id.volume_button:
                    mMuted = !mMuted;
                    if(mMuted) {
                        muteButton.setBackgroundResource(R.drawable.mute);
                        mute();
                    } else {
                        muteButton.setBackgroundResource(R.drawable.volume);
                        unmute();
                    }
                    break;
            }
        }
    };

    public void setPosterImageSource(String posterImageSource) {
        try {
            Uri uri = Uri.parse(posterImageSource);
            Glide.with(mThemedReactContext).load(uri).into(imageView);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setPosterImageResizeMode(String resizeMode) {
        try {
            imageView.setScaleType(ImageView.ScaleType.valueOf(resizeMode));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void setDisplayMode(String displayMode) {
        videoView.setDisplayMode(CustomVideoView.DisplayMode.valueOf(displayMode));
    }

    public void setSource(String source) {
       try {
           Uri uri = Uri.parse(source);
           videoView.setVideoURI(uri);
           videoView.start();
       } catch (Exception e) {
           e.printStackTrace();
       }
    }

    public void setRepeatModifier(boolean repeat) {
        mRepeat = repeat;
    }

    @SuppressLint("ClickableViewAccessibility")
    public void setPausedModifier(boolean paused) {
        videoView.setPausedModifier(paused);
    }

    public void setMutedModifier(boolean muted) {
        mMuted = muted;
        if(mMuted) {
            muteButton.setBackgroundResource(R.drawable.mute);
            mute();
        } else {
            muteButton.setBackgroundResource(R.drawable.volume);
            unmute();
        }
    }

    public void setEnableControls(boolean isEnabled) {
        mEnableControls = isEnabled;
    }

    public void mute() {
        this.setVolume(0);
    }

    public void unmute() {
        this.setVolume(70);
    }

    private void setVolume(int amount) {
        final int max = 100;//change 100 to zeo
        final double numerator = max - amount > 0 ? Math.log(max - amount) : 0;
        final float volume = (float) (1 - (numerator / Math.log(max)));

        try {
            if(mediaPlayer != null) {
                mediaPlayer.setVolume(volume, volume);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
