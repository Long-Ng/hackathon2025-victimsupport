
import React, { useState, useRef } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { MicIcon } from './icons/MicIcon';

const ActionToolkit: React.FC = () => {
    const [photo, setPhoto] = useState<string | null>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const handlePhotoClick = () => {
        photoInputRef.current?.click();
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAudioRecord = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    setAudioURL(url);
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
                setAudioURL(null); 
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access microphone. Please ensure you have given permission in your browser settings.");
            }
        }
    };

    return (
        <aside className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 md:p-6 space-y-6 h-full">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Action Toolkit</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Privately document evidence on your device. Nothing is uploaded or saved here.</p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                    <CameraIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Document with Photo</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Capture a photo of injuries, property damage, or your surroundings as evidence.</p>
                <input type="file" accept="image/*" capture="environment" ref={photoInputRef} onChange={handlePhotoChange} className="hidden" />
                <button onClick={handlePhotoClick} className="w-full text-sm font-semibold px-4 py-2 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors">
                    Take Photo
                </button>
                {photo && (
                    <div className="mt-4 space-y-3 border-t pt-3 border-slate-200 dark:border-slate-700">
                        <img src={photo} alt="Evidence preview" className="rounded-md max-h-48 w-full object-contain" />
                         <div className="flex space-x-2">
                            <a href={photo} download={`evidence-${Date.now()}.png`} className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-md bg-slate-600 text-white hover:bg-slate-700 transition-colors">Download</a>
                            <button onClick={() => setPhoto(null)} className="flex-1 text-sm font-semibold px-4 py-2 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">Clear</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                    <MicIcon className={`w-6 h-6 ${isRecording ? 'text-red-500 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`} />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Record Audio Log</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Record a verbal account of what happened. Describe events in your own words.</p>
                <button onClick={handleAudioRecord} className={`w-full text-sm font-semibold px-4 py-2 rounded-md transition-colors ${isRecording ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900' : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900'}`}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                {audioURL && (
                    <div className="mt-4 space-y-3 border-t pt-3 border-slate-200 dark:border-slate-700">
                        <audio controls src={audioURL} className="w-full" />
                        <div className="flex space-x-2">
                            <a href={audioURL} download={`audio-log-${Date.now()}.wav`} className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-md bg-slate-600 text-white hover:bg-slate-700 transition-colors">Download</a>
                            <button onClick={() => setAudioURL(null)} className="flex-1 text-sm font-semibold px-4 py-2 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">Clear</button>
                        </div>
                    </div>
                )}
            </div>

        </aside>
    );
};

export default ActionToolkit;
