import { Router } from "express";
import { createLink, getLinks } from "../controllers/links.controller";

const router = Router();

router.post('/shorten',createLink);
router.get('/links',getLinks);

export default router;