"use client";

import VideoPreview from "@/components/VideoPreview";
import { useEffect, useState, useCallback } from "react";
import { ReactMediaRecorder } from "react-media-recorder-2";

export default function Home() {
	const [file, setFile] = useState<Blob>();

	const [recording, setRecording] = useState(false);
	const [startTime, setStartTime] = useState(Date.now());

	const [presses, setPresses] = useState<Array<number>>([]);

	const onKeyPress = useCallback(
		(event: KeyboardEvent) => {
			setPresses(presses.concat(Date.now() - startTime));
		},
		[recording, startTime]
	);

	useEffect(() => {
		document.addEventListener("keydown", onKeyPress);

		return () => {
			document.removeEventListener("keydown", onKeyPress);
		};
	}, [onKeyPress]);

	const upload = async () => {
		const response = await fetch("/api/upload", { method: "POST", body: file });

		if (response.status === 200) {
			const id = await response.text();
			window.location.href = `/${id}`;
		}
	};

	return (
		<ReactMediaRecorder
			video
			onStart={() => {
				setRecording(true);
				setStartTime(Date.now());
			}}
			onStop={(url, blob) => {
				setFile(blob);
				setRecording(true);
			}}
			render={({
				status,
				startRecording,
				stopRecording,
				mediaBlobUrl,
				previewStream,
			}) => (
				<div>
					<p>{status}</p>
					<button onClick={startRecording}>Start Recording</button>
					<button onClick={stopRecording}>Stop Recording</button>

					{status === "recording" || status == "idle" ? (
						<VideoPreview stream={previewStream} />
					) : (
						<video src={mediaBlobUrl} controls autoPlay loop />
					)}

					{status === "stopped" && <button onClick={upload}>Upload</button>}
				</div>
			)}
		/>
	);
}
