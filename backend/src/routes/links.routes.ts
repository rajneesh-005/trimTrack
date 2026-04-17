import { Router } from "express";
import { createLink, getLinks } from "../controllers/links.controller";
import { validateURL } from "../middlewares/validateURL";

const router = Router();

router.post('/shorten',validateURL,createLink);
router.get('/links',getLinks);

export default router;