"use client";

import Metronome from "@/components/Metronome";
import VideoPreview from "@/components/VideoPreview";
import dynamic from "next/dynamic";
import { useState } from "react";

import logo from "../../public/logo.png";
import Image from "next/image";

const ReactMediaRecorder = dynamic(
	() => import("react-media-recorder-2").then((mod) => mod.ReactMediaRecorder),
	{
		ssr: false,
	}
);

export default function Home() {
	const [file, setFile] = useState<Blob>();

	const [startTime, setStartTime] = useState(Date.now());

	const [clicks, setClicks] = useState<Array<number>>([]);

	const [loading, setLoading] = useState(false);

	const upload = async () => {
		setLoading(true);

		try {
			const uploadResponse = await fetch("/api/upload", {
				method: "POST",
				body: file,
			});
			const id = await uploadResponse.text();
			console.log("uploaded");

			const response = await fetch(`/api/get-audio?id=${id}`, {
				method: "POST",
			});
			const spikes = await response.json();
			console.log("got audio", spikes);

			// get frames of each spike
			await fetch(`/api/frames?id=${id}&frames=${spikes.join(",")}`, {
				method: "POST",
			});
			console.log("got frames");

			// cut frames in halves
			await fetch(`/api/halves?id=${id}&frames=${spikes.join(",")}`, {
				method: "POST",
			});
			console.log("cropped video");

			// get detections for each spike
			await fetch(`/api/detect?id=${id}&frames=${spikes.join(",")}`, {
				method: "POST",
			});
			console.log("got detections");

			console.log(clicks);
			await fetch(`/api/spacebar?id=${id}&frames=${clicks.join(",")}`, {
				method: "POST",
			});
			console.log("added spacebar");

			await new Promise((resolve) => setTimeout(resolve, 5000));

			window.location.href = `/yolo/fjskldf`;
		} catch (error) {
			alert("Something went wrong!");
			setLoading(false);
		}
	};

	return (
		<>
			{loading && (
				<div className="fixed top-0 left-0 w-screen h-screen z-20 bg-black/60 grid place-items-center">
					<div className="flex space-x-4 items-center">
						<div role="status">
							<svg
								aria-hidden="true"
								className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>

						<div className="text-2xl">Loading...</div>
					</div>
				</div>
			)}
			<ReactMediaRecorder
				video
				onStart={() => {
					setStartTime(Date.now());
				}}
				onStop={(url, blob) => {
					setFile(blob);
				}}
				render={({
					status,
					startRecording,
					stopRecording,
					mediaBlobUrl,
					previewStream,
				}) => (
					<div className="px-48 py-4 space-y-2">
						<div className="flex justify-between items-center h-10">
							<div className="flex space-x-2 items-center">
								{status == "idle" && (
									<>
										<div className="rounded-full w-6 h-6 bg-green-500"></div>
										<div>Ready</div>
									</>
								)}
								{status == "acquiring_media" && (
									<>
										<div role="status">
											<svg
												aria-hidden="true"
												className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
											<span className="sr-only">Loading...</span>
										</div>
										<div>Loading</div>
									</>
								)}
								{status == "recording" && (
									<>
										<div className="rounded-full w-6 h-6 bg-red-500"></div>
										<div>Recording</div>
									</>
								)}
								{status == "stopped" && (
									<>
										<div className="w-6 h-6 bg-red-500"></div>
										<div>Stopped</div>
									</>
								)}
							</div>

							{status === "recording" && (
								<div className="flex space-x-2 items-center">
									<button
										className="rounded-md bg-sky-800/50 p-2 "
										onClick={() => {
											setClicks([...clicks, Date.now() - startTime]);
										}}
									>
										Add Hat
									</button>
								</div>
							)}

							{status === "idle" && (
								<Image alt="TapTrax logo" height={50} src={logo} />
							)}

							<div className="flex space-x-2 items-center">
								{status === "idle" && (
									<button
										className="rounded-md bg-sky-800/50 p-2 "
										onClick={startRecording}
									>
										Start Recording
									</button>
								)}

								{status === "recording" && (
									<>
										<button
											className="rounded-md bg-sky-800/50 p-2 "
											onClick={stopRecording}
										>
											Stop Recording
										</button>
										<Metronome />
									</>
								)}

								{status === "stopped" && (
									<>
										<button
											className="rounded-md bg-sky-800/50 p-2 "
											onClick={upload}
										>
											Upload Recording
										</button>
										<button
											className="rounded-md bg-sky-800/50 p-2 "
											onClick={() => (window.location.href = "/")}
										>
											Reset Recording
										</button>
									</>
								)}
							</div>
						</div>

						{status === "recording" || status == "idle" ? (
							<VideoPreview stream={previewStream} />
						) : (
							<video
								className="w-full rounded-xl"
								src={mediaBlobUrl}
								controls
								autoPlay
								loop
							/>
						)}
					</div>
				)}
			/>
		</>
	);
}
