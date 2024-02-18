import denoise from "@/utils/denoise";
import getPeaks from "@/utils/getPeaks";
import { exec } from "child_process";
import { NextRequest } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;

	const dir = join("../", "tmp", id) + "/";

	const getAudio = () => {
		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -i ${dir}input.mp4 -vn -acodec pcm_s16le -ar 44100 -ac 2 ${dir}input.wav`,
				(error) => {
					if (error) {
						reject(error);
						console.error(error);
					} else {
						resolve("done jit");
					}
				}
			);
		});
	};

	await getAudio();
	await denoise(`${dir}input.wav`, `${dir}denoised.wav`);
	const times: number[] = await getPeaks(`${dir}denoised.wav`);
	const peaks: string[] = [];
	for (const i of times) {
		peaks.push(
			Number(i * 1000)
				.toString()
				.split(".")[0]
		);
	}
	console.log("peaks: ", peaks);
	return new Response(JSON.stringify(peaks), { status: 200 });
}
