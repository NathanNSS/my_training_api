import {Request, Response, NextFunction} from "express-serve-static-core";
import {RateLimiterMemory, RateLimiterRes} from "rate-limiter-flexible";
import z from "zod";

import {ErrorExpress} from "../model/errorHandlingExpress";
import {fakeAwait, getIpClient} from "../utils";

export function genericPrevBruteForce(req: Request, res: Response, next: NextFunction) {
    const opts = {
        points: 6, // 6 points
        duration: 1, // Per second
    };

    const rateLimiter = new RateLimiterMemory(opts);

    const ip = getIpClient(req);

    if (!ip) return next();

    rateLimiter
        .consume(ip, 2) //consume
        .then(() => {
            next();
        })
        .catch((rateLimiterRes) => {
            const err = new ErrorExpress({
                name: "Too Many Requests",
                statusCode: 429,
                description: JSON.stringify(rateLimiterRes),
            });

            next(err);
        });
}

export async function loginPrevBruteForce(req: Request, res: Response, next: NextFunction) {
    const schemaLoginReq = z.object({
        email: z.string().email(),
        password: z.string(),
    });

    const {email, password} = schemaLoginReq.parse(req.body);

    const maxWrongAttemptsByIPperDay = 5;
    const maxConsecutiveFailsByUsernameAndIP = 10;

    const limiterSlowBruteByIP = new RateLimiterMemory({
        //storeClient: redisClient,
        //useRedisPackage: true,
        keyPrefix: "login_fail_ip_per_day",
        points: maxWrongAttemptsByIPperDay,
        duration: 60 * 60 * 24,
        blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
    });

    const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMemory({
        //storeClient: redisClient,
        keyPrefix: "login_fail_consecutive_username_and_ip",
        points: maxConsecutiveFailsByUsernameAndIP,
        duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
        blockDuration: 60 * 60, // Block for 1 hour
    });

    const makeKey = (username: string, ip: string) => `${username}_${ip}`;

    const ip = getIpClient(req);

    if (!ip) return next(); //Melhorar isso futuramente!

    const key = makeKey(email, ip);

    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
        limiterConsecutiveFailsByUsernameAndIP.get(key),
        limiterSlowBruteByIP.get(ip),
    ]);

    let retrySecs = 0;

    // Check if IP or Username + IP is already blocked
    if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (
        resUsernameAndIP !== null &&
        resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
    ) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set("Retry-After", String(retrySecs));

        const err = new ErrorExpress({
            name: "Too Many Requests",
            statusCode: 429,
        });

        return next(err);
    }

    // console.log("retrySecs", retrySecs);
    // console.log("key", key);

    // console.log("resSlowByIP", resSlowByIP?.msBeforeNext);
    // console.log("resUsernameAndIP", resUsernameAndIP?.msBeforeNext);

    const fakeAuthorize = async (email: string, password: string) => {
        const res = {
            isLoggedIn: true,
            exists: {
                id: 1,
                name: "cleiton",
                email: "cleiton@email.com",
            },
        };

        if (email !== "cleiton@email.com" || password !== "123456") res.isLoggedIn = false;

        return fakeAwait(res, true);
    };

    const user = await fakeAuthorize(email, password); // Implementar a Logica de autenticação no sistemas futuramente

    if (!user?.isLoggedIn) {
        // Consume 1 point from limiters on wrong attempt and block if limits reached
        try {
            const promises = [limiterSlowBruteByIP.consume(ip)];
            if (user?.exists) {
                // Count failed attempts by Username + IP only for registered users
                promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(key));
            }

            await Promise.all(promises);

            res.status(400).end("email or password is wrong");
        } catch (error) {
            if (error instanceof Error) {
                const err = new ErrorExpress();

                return next(err);
            } else {
                const rlRejected = error as RateLimiterRes;
                res.set("Retry-After", String(Math.round(rlRejected.msBeforeNext / 1000)) || "1");

                const err = new ErrorExpress({
                    name: "Too Many Requests",
                    statusCode: 429,
                });

                return next(err);
            }
        }
    }

    if (user.isLoggedIn) {
        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
            // Reset on successful authorisation
            await limiterConsecutiveFailsByUsernameAndIP.delete(key);
        }

        res.end("authorized");
    }
}
