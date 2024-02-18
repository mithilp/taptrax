import { useEffect, useRef } from "react";

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);
	if (!stream) {
		return null;
	}
	return (
		<video className="w-full rounded-xl" ref={videoRef} autoPlay controls />
	);
};

export default VideoPreview;
