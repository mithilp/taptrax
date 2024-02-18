"use client";

import playDrum from "@/utils/playDrum";

const PlayButton = ({ data }: { data: Array<any> }) => {
	return (
		<button
			className="p-4 text-xl bg-sky-800/50 rounded-md"
			onClick={() => playDrum(data)}
		>
			Play Audio
		</button>
	);
};

export default PlayButton;
