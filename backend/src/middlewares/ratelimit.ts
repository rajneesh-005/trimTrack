import {rateLimit} from 'express-rate-limit';

export const shortenLimiter = rateLimit({
    windowMs:10*60*1000,
    limit:10,
    standardHeaders:'draft-8',
    message:'Too many requests, please try again later',
    legacyHeaders:false,
    ipv6Subnet:56
});