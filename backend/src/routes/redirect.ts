import { Router } from "express";
import { redirect } from "../controllers/redirect.controller";
const router = Router();

router.get('/:code',redirect);

export default router;