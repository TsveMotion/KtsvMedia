'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

export default function MeetingRoom() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params?.id as string;
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);

  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Initialize media stream with proper error handling
  const initializeMedia = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError('');

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Your browser does not support media devices');
      }

      const constraints = {
        audio: true,
        video: {
          width: { ideal: isMobileDevice ? 640 : 1280 },
          height: { ideal: isMobileDevice ? 480 : 720 },
          facingMode: 'user'
        }
      };

      console.log('Requesting media access...');
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Media access granted');

      if (!stream) {
        throw new Error('Failed to get media stream');
      }

      localStream.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play();
        console.log('Local video playing');
      }

      // Set initial track states
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });

      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOff;
      });

      setIsConnecting(false);
    } catch (error: unknown) {
      console.error('Media initialization error:', error);
      let errorMessage = 'Could not access media devices';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Please allow access to your camera and microphone';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera or microphone found';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera or microphone is already in use';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Camera does not support required settings';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setIsConnecting(false);
    }
  }, [isMobileDevice, isMuted, isVideoOff]);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };
    setIsMobileDevice(checkMobile());
  }, []);

  // Initialize media on mount
  useEffect(() => {
    if (meetingId) {
      console.log('Initializing media...');
      initializeMedia();
    }

    return () => {
      console.log('Cleaning up media...');
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [meetingId, initializeMedia]);

  const toggleMute = () => {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTracks = localStream.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleLeaveMeeting = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full w-full p-2 sm:p-4 flex flex-col"
      >
        {isConnecting ? (
          <div className="flex items-center justify-center flex-grow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-white text-lg">Connecting to your meeting...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-grow p-4">
            <div className="text-center max-w-md mx-auto">
              <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
              <p className="text-gray-300 text-lg">Please make sure your camera and microphone are connected and you&apos;ve granted permission to use them.</p>
              <button 
                onClick={() => initializeMedia()}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 relative">
            {/* Local video */}
            <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 bg-black bg-opacity-75 backdrop-blur-sm px-4 py-2 rounded-full">
                <button
                  onClick={toggleMute}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? '🔇' : '🎤'}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {isVideoOff ? '📵' : '📹'}
                </button>

                <button
                  onClick={handleLeaveMeeting}
                  className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  ❌
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
