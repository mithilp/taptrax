import { exec } from "child_process";
import { mkdir } from "fs/promises";
import { NextRequest } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;

	const frameStrings = searchParams.get("frames") as string;
	const frames = frameStrings.split(",");

	console.log("started getting frames", id);

	const getFrames = async (time: number) => {
		console.log("getting frame ", time);

		await mkdir(join("../", "tmp", id, time.toString()));

		const dir = join("../", "tmp", id) + "/";

		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -ss ${
					time / 1000
				} -i ${dir}input.mp4 -frames:v 1 -q:v 2 ${dir}${time}/og.jpg`,
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

	for await (const time of frames) {
		await getFrames(parseInt(time));
	}

	console.log("finished getting frames", id);

	return new Response("Success", { status: 200 });
}
