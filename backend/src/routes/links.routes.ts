import { Router } from "express";
import { createLink, getLinks } from "../controllers/links.controller";
import { validateURL } from "../middlewares/validateURL";
import { shortenLimiter } from "../middlewares/ratelimit";

const router = Router();

router.post('/shorten',shortenLimiter,validateURL,createLink);
router.get('/links',getLinks);

export default router;