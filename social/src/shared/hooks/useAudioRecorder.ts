import { useState, useRef, useCallback, useEffect } from 'react';

export interface AudioRecordResult {
  uri: string;
  durationSeconds: number;
  waveform: number[];
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setDuration(0);
    setWaveformData([]);

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
      // Simulate real-time audio amplitude spectrum
      const randomAmp = Math.floor(Math.random() * 24) + 4;
      setWaveformData((prev) => [...prev.slice(-20), randomAmp]);
    }, 200);
  }, []);

  const stopRecording = useCallback((): Promise<AudioRecordResult> => {
    return new Promise((resolve) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);

      const result: AudioRecordResult = {
        uri: 'file:///mock/voice_note_' + Date.now() + '.m4a',
        durationSeconds: Math.max(1, Math.round(duration / 5)),
        waveform: waveformData.length > 0 ? waveformData : [8, 14, 18, 10, 6, 20, 12, 8],
      };

      resolve(result);
    });
  }, [duration, waveformData]);

  const cancelRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setDuration(0);
    setWaveformData([]);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isRecording,
    duration,
    waveformData,
    formattedDuration: formatDuration(Math.round(duration / 5)),
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
