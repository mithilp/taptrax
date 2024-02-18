import { exec } from "child_process";

const denoise = async (input: string, output: string) => {
	return new Promise((resolve, reject) => {
		exec(
			`ffmpeg \
    -i ${input} \
    -filter:a "afftdn=nr=90:nf=-20:tn=0" \
    -c:a pcm_s16le \
   	${output}`,
			(error: any) => {
				if (error) {
					reject(error);
					console.error(error);
				} else {
					resolve("done");
				}
			}
		);
	});
};

export default denoise;
