import { Router } from "express";
import { createLink } from "../controllers/links.controller";

const router = Router();

router.post('/shorten',createLink);

export default router;