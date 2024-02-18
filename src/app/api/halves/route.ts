import { exec } from "child_process";
import { mkdir } from "fs/promises";
import { NextRequest } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;

	const frameStrings = searchParams.get("frames") as string;
	const frames = frameStrings.split(",");

	console.log("start cutting into halves", id);

	const getHalves = async (time: number) => {
		console.log("converting video into 2 halves", id);

		const dir = join("./", "tmp", id, time.toString()) + "/";

		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -i ${dir}og.jpg -filter:v "crop=iw/2:ih/2:0:oh" ${dir}bottom.jpg ; ffmpeg -i ${dir}og.jpg -filter:v "crop=iw/2:ih/2:0:0" ${dir}top.jpg`,
				(error) => {
					if (error) {
						reject(error);
						console.error(error);
					} else {
						console.log("image cropped successfully");
						resolve("image cropped successfully");
					}
				}
			);
		});
	};

	for await (const time of frames) {
		await getHalves(parseInt(time));
	}

	console.log("done cutting into halves", id);

	return new Response("Success", { status: 200 });
}
