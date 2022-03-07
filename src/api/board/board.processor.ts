import spawnAsync from "@expo/spawn-async";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import * as fs from "fs";
import { join } from "path";

@Processor("meeting")
export class BoardProcessor {
    @Process("color")
    async color(job: Job) {
        try {
            const { filename } = job.data;

            console.log(`Get ${filename}`);

            if (
                !fs.existsSync(
                    `${join(
                        __dirname,
                        "..",
                        "..",
                        "..",
                        "..",
                        "..",
                        "public",
                        `${filename.split(".")[0]}.csv`
                    )}`
                )
            ) {
                console.log(`Processing... ${filename}`);
                console.log(`${join(__dirname, "..", "..", "..", "..", "..")}`);
                const spawnPromise = spawnAsync(`bash`, [
                    "~/Projects/kokoro-server/getColor.sh",
                    filename,
                ]);

                const child = spawnPromise.child;

                child.stdout.on("data", (data) => {
                    console.log(data);
                });

                await Promise.all([spawnPromise]);

                console.log(`Success ${filename}`);
                console.log(spawnPromise);

                return;
            } else {
                console.log(
                    `${join(
                        __dirname,
                        "..",
                        "..",
                        "..",
                        "..",
                        "..",
                        "public",
                        `${filename.split(".")[0]}.csv`
                    )} alrady exists`
                );
                return;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
