import { exec } from "child_process";
import { mkdir } from "fs/promises";
import { NextRequest } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;

	console.log("start cutting into halves", id);

	const convertVideo = async () => {
		console.log("converting video into 2 halves", id);

		const dir = join("./", "tmp", id) + "/";

		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -i ${dir}input.mp4 -filter_complex "[0]crop=iw/2:ih:0:0[left];[0]crop=iw/2:ih:ow:0[right]" -map "[left]" ${dir}left.mp4 -map "[right]" ${dir}right.mp4 ; ffmpeg -i ${dir}left.mp4 -filter_complex "[0]crop=iw:ih/2:0:0[top];[0]crop=iw:ih/2:0:oh[bottom]" -map "[top]" ${dir}top.mp4 -map "[bottom]" ${dir}bottom.mp4`,
				(error) => {
					if (error) {
						reject(error);
						console.error(error);
					} else {
						console.log("Video cropped successfully");
						resolve("Video cropped successfully");
					}
				}
			);
		});
	};

	await convertVideo();

	console.log("done cutting into halves", id);

	return new Response("Success", { status: 200 });
}
