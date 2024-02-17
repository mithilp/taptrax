import { exec } from "child_process";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;

	console.log("start", id);

	const convertVideo = async () => {
		console.log("Converting video", id);

		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -i ${process
					.cwd()
					.replace(
						" ",
						"\\ "
					)}/tmp/${id}/input.mp4 -filter_complex "[0]crop=iw:ih/2:0:0[top];[0]crop=iw:ih/2:0:oh[bottom]" -map "[top]" ${process
					.cwd()
					.replace(" ", "\\ ")}/tmp/${id}/top.mp4 -map "[bottom]" ${process
					.cwd()
					.replace(" ", "\\ ")}/tmp/${id}/bottom.mp4`,
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

	console.log("done", id);

	return new Response("Hello World", { status: 200 });
}
