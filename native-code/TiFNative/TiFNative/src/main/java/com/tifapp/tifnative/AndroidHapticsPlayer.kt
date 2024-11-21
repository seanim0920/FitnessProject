package com.tifapp.tifnative

import android.annotation.TargetApi
import android.media.MediaPlayer
import android.os.VibrationEffect
import android.os.Vibrator

@TargetApi(26)
public class AndroidHapticsPlayer: HapticsPlayer {
    companion object {
        var mPlayer: MediaPlayer?=null
        val vibrator: Vibrator?=null

        private fun getMediaPlayer(): MediaPlayer {
            if (mPlayer == null) {
                mPlayer = MediaPlayer()
            }
            return mPlayer!!
        }
    }

    override suspend fun playSound(element: HapticPatternElement.AudioCustom) {
        mPlayer = getMediaPlayer()
        mPlayer!!.reset()
        mPlayer?.apply {
            setDataSource(element.waveformPath)
            setVolume(element.volume.toFloat(), element.volume.toFloat())
            prepare()
            start()
        }
    }

    public override suspend fun playEffect(effect: HapticPatternElement) {
        when (effect) {
            is HapticPatternElement.AudioCustom -> playSound(effect)
            is HapticPatternElement.TransientEvent -> vibrator?.vibrate(
                VibrationEffect.createOneShot(effect.time.toLong(),
                effect.intensity.toInt()
            ))
            is HapticPatternElement.ContinuousEvent -> vibrator?.vibrate(VibrationEffect.createWaveform(longArrayOf(
                0,
                effect.duration.toLong()
            ), intArrayOf(effect.intensity.toInt(), effect.intensity.toInt()), -1))
        }
    }
    suspend fun playHapticPattern(ahapPattern: ExpoObject){
        val readablePattern = createReadablePattern(ahapPattern)
        readablePattern.events.forEach { patternElement ->
            playEffect(patternElement)
        }
    }
}