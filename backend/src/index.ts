import { ApiServer } from "./api/server";

export async function main(): Promise<void> {
    const port = Number(process.env.PORT) || 4000;
    await ApiServer.run(port);
}

main();
