import {Request} from "express-serve-static-core";

export async function fakeAwait<T>(response: T, resOrRej: boolean): Promise<T> {
    return new Promise<T>((res, rej) => {
        setTimeout(() => {
            if (!resOrRej) rej(response);
            res(response);
        }, 500);
    });
}

export function getIpClient(req: Request): string {
    const rawRemoteAddress = req?.ip ?? req.headers["x-forwarded-for"];

    if (!rawRemoteAddress) return "";

    let remoteAddress: string | string[];

    if (Array.isArray(rawRemoteAddress)) {
        remoteAddress = rawRemoteAddress[0].trim();
    } else {
        remoteAddress = rawRemoteAddress.split(",")[0].trim();
    }

    return remoteAddress;
}
