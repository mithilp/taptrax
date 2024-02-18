"use client";

import playDrum from "@/utils/playDrum";

const PlayButton = ({ data }: { data: Array<any> }) => {
	return <button onClick={() => playDrum(data)}>Play Audio</button>;
};

export default PlayButton;
