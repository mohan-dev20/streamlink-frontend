"use client";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import { PictureInPicture2 } from "lucide-react";

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageCircle,
  PhoneOff,
  Copy,
} from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function VideoCallPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startCamera();

    socket.on("connect", () => {
      setCallStatus("Socket Connected");
      console.log("Connected:", socket.id);
    });
    socket.on("call-rejected", () => {
      setCalling(false);

      toast.error("Call Rejected");
    });

    socket.on("offer", (offer) => {
      console.log("Incoming Call");

      setIncomingOffer(offer);
      setIncomingCall(true);
    });

    socket.on("answer", async (answer) => {
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      setCalling(false);
      setCallAccepted(true);
      setCallConnected(true);
      console.log("Answer Received");
    });
    socket.on("ice-candidate", async (candidate) => {
      try {
        if (!peerConnection.current) return;

        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );

        console.log("ICE Candidate Added");
      } catch (err) {
        console.log("ICE Error", err);
      }
    });

    socket.on("disconnect", () => {
      setCallStatus("Socket Disconnected");
    });

    socket.on("chat-message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.sender || "Friend",
          message: data.message,
          time:
            data.time ||
            new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        },
      ]);
    });
    socket.on("user-joined", () => {
      setParticipants((prev) => prev + 1);

      toast.success("Friend Joined");
    });
    socket.on("user-left", () => {
      setParticipants((prev) => Math.max(1, prev - 1));

      toast("Friend Left");
    });
    return () => {
      socket.off("connect");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("disconnect");
      socket.off("chat-message");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("call-rejected");
    };
  }, []);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast("Your browser does not support camera access.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("Audio failed. Trying video only.");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.log(e);
       toast("Camera access failed.");
      }
    }
  };
  const startRecording = () => {
    if (!localStreamRef.current) {
      toast.error("Camera is not started.");
      return;
    }

    chunksRef.current = [];

    try {
      const recorder = new MediaRecorder(localStreamRef.current);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setRecording(true);
        setRecordTime(0);

        toast.success("Recording Started");
      };

      recorder.start();
    } catch (err) {
      console.error(err);

      toast.error("Recording is not supported on this browser.");

      setRecording(false);
    }
  };
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      // Change local preview
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      // Send screen to remote user
      const sender = peerConnection.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");

      sender?.replaceTrack(screenTrack);

      setScreenSharing(true);

      // When user stops sharing
      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.log(err);
    }
  };
  const stopScreenShare = async () => {
    if (!localStreamRef.current) return;

    const cameraTrack = localStreamRef.current.getVideoTracks()[0];

    const sender = peerConnection.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");

    sender?.replaceTrack(cameraTrack);

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    setScreenSharing(false);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setCameraOff(!cameraOff);
  };
  const endCall = () => {
    // Stop local media
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      socket.disconnect();
      peerConnection.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setCallConnected(false);
    setCallTime(0);
    toast("Call Ended");
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX - videoPosition.x,
      y: e.touches[0].clientY - videoPosition.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setVideoPosition({
      x: e.touches[0].clientX - touchStart.current.x,
      y: e.touches[0].clientY - touchStart.current.y,
    });
  };

  const [connectionQuality, setConnectionQuality] = useState("Excellent");
  const [participantCount, setParticipantCount] = useState(1);
  const [callStatus, setCallStatus] = useState("Waiting...");
  const [notification, setNotification] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [cameraOff, setCameraOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [message, setMessage] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [calling, setCalling] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [position, setPosition] = useState({
    x: 20,
    y: 20,
  });

  const [dragging, setDragging] = useState(false);

  const [messages, setMessages] = useState<
    {
      sender: string;
      message: string;
      time: string;
    }[]
  >([]);
  const dragStart = useRef({
    x: 0,
    y: 0,
  });
  const [videoPosition, setVideoPosition] = useState({
    x: 20,
    y: 20,
  });

  const touchStart = useRef({
    x: 0,
    y: 0,
  });
  const togglePiP = async () => {
    if (!localVideoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await localVideoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.log(err);
      toast.error("Picture in Picture not supported.");
    }
  };
  useEffect(() => {
    const qualities = ["Excellent", "Good", "Weak"];

    const interval = setInterval(() => {
      const random = qualities[Math.floor(Math.random() * qualities.length)];

      setConnectionQuality(random);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (recording) {
      timer = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [recording]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  const [participants, setParticipants] = useState(1);
  const roomIdRef = useRef("");
  useEffect(() => {
    socket.on("room-users", (users) => {
      setParticipants(users.length);
    });
    let timer: NodeJS.Timeout;
    if (callConnected) {
      timer = setInterval(() => {
        setCallTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [callConnected]);
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    // Stop REC indicator
    setRecording(false);

    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `StreamLink-${Date.now()}.webm`;
      a.click();

      URL.revokeObjectURL(url);

      toast.success("Recording Downloaded");
    };
  };
  const toggleMute = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };
  const toggleMic = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  const joinRoom = () => {
    if (!roomId.trim()) {
     toast("Enter Room ID");
      return;
    }

    roomIdRef.current = roomId;

    socket.emit("join-room", roomId);

    setJoinedRoom(true);

    toast.success(`Joined Room: ${roomId}`);
  };
  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      sender: "You",
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socket.emit("chat-message", {
      roomId: roomIdRef.current,
      ...data,
    });

    setMessages((prev) => [...prev, data]);

    setMessage("");
  };
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });
    peerConnection.current = pc;
    if (localStreamRef.current) {
      console.log("Tracks Added:", localStreamRef.current?.getTracks());
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
        console.log("Added Track:", track.kind);
      });
    }
    pc.ontrack = (event) => {
      console.log("Remote Stream Received");

      if (!remoteVideoRef.current) return;

      if (remoteVideoRef.current.srcObject !== event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }

      remoteVideoRef.current
        .play()
        .catch((err) => console.log("Play skipped:", err));

      setCallConnected(true);
    };
    pc.onconnectionstatechange = () => {
      console.log("Connection State:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setCallConnected(true);
      }
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed" ||
        pc.connectionState === "closed"
      ) {
        setCallConnected(false);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE State:", pc.iceConnectionState);
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE");
        socket.emit("ice-candidate", {
          roomId: roomIdRef.current,
          candidate: event.candidate,
        });
      }
    };
    return pc;
  };

  const acceptCall = async () => {
    await startCamera();
    if (!incomingOffer) return;
    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", {
      roomId: roomIdRef.current,
      answer,
    });
    setIncomingCall(false);
    setIncomingOffer(null);
    setCallStatus("Connected");
    setParticipantCount(2);

    console.log("Call Accepted");
  };
  const rejectCall = () => {
    socket.emit("reject-call", roomIdRef.current);

    setIncomingCall(false);

    setIncomingOffer(null);

    toast.error("Call Rejected");
  };
  const startCall = async () => {
    if (!joinedRoom) {
      toast.error("Join a room first");
      return;
    }

    await startCamera();
    setCalling(true);

    const pc = createPeerConnection();

    const offer = await pc.createOffer();

    await pc.setLocalDescription(offer);

    socket.emit("offer", {
      roomId: roomIdRef.current,
      offer,
    });

    setCallStatus("Calling...");
  };
  const handleRecording = () => {
    if (recording) {
      stopRecording();
      setRecording(false);
    } else {
      startRecording();
      setRecording(true);
    }
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);

    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0f172a] text-white">
        <div className="max-w-7xl mx-auto px-2 py-2 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900 rounded-2xl px-4 py-3 md:px-6 md:py-4 mb-6 shadow-xl">
              <div>
                <h1 className="text-3xl font-bold">Video Call</h1>

                <p className="text-gray-400 mt-1">
                  Room :{" "}
                  <span className="text-white font-semibold">
                    {roomId || "Not Joined"}
                  </span>
                </p>
              </div>

              <div
                className="
grid
grid-cols-2
gap-4
mt-4

md:flex
md:gap-8
md:mt-0
"
              >
                <div>
                  <p className="text-xs text-gray-400">Status</p>

                  <p className="font-semibold text-green-500">
                    {callConnected ? "Connected" : "Waiting"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Duration</p>

                  <p>
                    {Math.floor(callTime / 60)}:
                    {String(callTime % 60).padStart(2, "0")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Participants</p>

                  <p>{participants}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Network</p>

                  <p className="text-green-500">{connectionQuality}</p>
                </div>
              </div>
            </div>

            {notification && (
              <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-6 py-3 rounded-xl shadow-xl z-50 animate-pulse">
                {notification}
              </div>
            )}
          </div>
          {calling && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-slate-900 rounded-3xl p-10 text-center shadow-2xl">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 animate-pulse flex items-center justify-center text-3xl">
                  📞
                </div>

                <h2 className="text-2xl font-bold mt-6">Calling...</h2>

                <p className="text-gray-400 mt-2">
                  Waiting for the other user to answer
                </p>

                <button
                  onClick={() => {
                    setCalling(false);
                    endCall();
                  }}
                  className="mt-8 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl"
                >
                  Cancel Call
                </button>
              </div>
            </div>
          )}

          {recording && (
            <div className="absolute top-5 left-5 z-50 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />

              <span className="font-bold text-red-500">REC</span>

              <span className="text-white text-sm">
                {Math.floor(recordTime / 60)}:
                {String(recordTime % 60).padStart(2, "0")}
              </span>
            </div>
          )}
          <div
            className="relative w-full h-[55vh]
sm:h-[60vh]
md:h-[70vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover bg-black"
            />

            {/* Placeholder when nobody is connected */}
            {!callConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950">
                <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-5xl">
                  👤
                </div>

                <h2 className="mt-5 text-2xl font-bold text-white">
                  Waiting for another participant...
                </h2>

                <p className="text-gray-400 mt-2">
                  Share your Room ID to start the call
                </p>
              </div>
            )}
            {!joinedRoom ? (
              <div
                className="absolute

top-3
left-1/2
-translate-x-1/2

md:left-auto
md:right-5
md:translate-x-0 bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl w-[90%]
max-w-xs
md:w-80"
              >
                <h2 className="text-xl font-bold mb-3">Join a Room</h2>

                <input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none mb-4"
                />

                <button
                  onClick={joinRoom}
                  className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-semibold transition"
                >
                  Join Room
                </button>
              </div>
            ) : (
              <div
                className="absolute

top-3
left-1/2
-translate-x-1/2

md:left-auto
md:right-5
md:translate-x-0 bg-green-600 rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div>
                  <p className="text-xs opacity-80">Joined Room</p>

                  <p className="font-bold">{roomId}</p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    toast.success("Room ID Copied");
                  }}
                >
                  <Copy size={20} />
                </button>
              </div>
            )}
            {/* Local Video (Floating Preview) */}

            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              style={{
                transform: `translate(${videoPosition.x}px, ${videoPosition.y}px)`,
              }}
              className="absolute z-40 cursor-move select-none"
            >
              <div
                className="
   w-24 h-32
sm:w-32 sm:h-40
md:w-56 md:h-36
lg:w-72 lg:h-44
    rounded-2xl
    overflow-hidden
    border-2
    border-white/30
    bg-black
    shadow-[0_15px_40px_rgba(0,0,0,0.45)]
    transition
    hover:scale-105
    "
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-2 left-2 bg-black/60 px-3 py-1 rounded-full text-xs">
                  You
                </div>
              </div>
            </div>
          </div>

          <div
            className="fixed
bottom-2
left-1/2
-translate-x-1/2
z-50 left-1/2 -translate-x-1/2 z-40"
          >
            <div
              className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full px-3 py-4 md:px-6 md:py-3 shadow-2xl"
            >
              {/* Mic */}
              <button
                onClick={toggleMic}
                title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition ${
                  micOn
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                {micOn ? (
                  <Mic className="w-4 h-4 md:w-6 md:h-6" />
                ) : (
                  <MicOff className="w-4 h-4 md:w-6 md:h-6" />
                )}
              </button>

              {/* Camera */}
              <button
                onClick={toggleCamera}
                title={cameraOn ? "Turn Camera Off" : "Turn Camera On"}
              className={`w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                  cameraOn
                    ? "bg-slate-700 hover:bg-slate-600"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                {cameraOn ? <Video className="w-4 h-4 md:w-6 md:h-6" /> : <VideoOff className="w-4 h-4 md:w-6 md:h-6" />}
              </button>

              {/* Screen Share */}
              <button
                onClick={screenSharing ? stopScreenShare : shareScreen}
                title="Share Screen"
                className={`w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center transition ${
                  screenSharing
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                <MonitorUp className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <p className="text-xs text-center mt-1">
                {screenSharing ? "Sharing" : "Screen"}
              </p>

              {/* Chat */}
              <button
                onClick={() => setChatOpen(!chatOpen)}
                title="Open Chat"
                className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-slate-700 hover:bg-green-600 flex items-center justify-center transition"
              >
                <MessageCircle size={18} />
              </button>

              {/* Recording */}
              <button
                onClick={handleRecording}
                className={`w-9 h-9 md:w-14 md:h-14 rounded-full flex items-center justify-center transition ${
                  recording
                    ? "bg-red-600 animate-pulse"
                    : "bg-slate-700 hover:bg-purple-600"
                }`}
              >
                ⚪
              </button>
              <button
                onClick={startCall}
                className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition"
              >
                📞
              </button>

              {/* End Call */}
              <button
                onClick={endCall}
                title="End Call"
                className="w-9 h-9 md:w-14 md:h-14 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg transition"
              >
                <PhoneOff size={18} />
              </button>
              <button
                onClick={togglePiP}
                title="Picture in Picture"
                className="w-9 h-9 md:w-14 md:h-14 rounded-full bg-slate-700 hover:bg-blue-600 flex items-center justify-center transition"
              >
                <PictureInPicture2 className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {incomingCall && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md">
              <div className="w-[380px] bg-slate-900 rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-5xl mx-auto shadow-xl">
                  👤
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold mt-6">Incoming Call</h2>

                {/* Caller */}
                <p className="text-gray-400 mt-2">Friend is calling...</p>

                {/* Ring Animation */}
                <div className="mt-8 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 animate-ping"></div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-8 mt-10">
                  <button
                    onClick={acceptCall}
                    className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-500 text-white text-3xl transition shadow-lg"
                  >
                    📞
                  </button>

                  <button
                    onClick={rejectCall}
                    className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white text-3xl transition shadow-lg"
                  >
                    ✖
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {chatOpen && (
          <div
            className="
      fixed
      right-6
      top-24
      bottom-28
      w-[380px]
      bg-zinc-900
      rounded-2xl
      border
      border-zinc-700
      shadow-2xl
      flex
      flex-col
      z-50
    "
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Chat</h2>

              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg ${
                      msg.sender === "You"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-slate-700 text-white rounded-bl-md"
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1 opacity-80">
                      {msg.sender}
                    </p>

                    <p className="text-sm">{msg.message}</p>

                    <div className="text-[10px] opacity-70 mt-2 text-right">
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-zinc-700 p-4 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-slate-800 rounded-xl px-4 py-3 outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-500 px-5 rounded-xl"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
