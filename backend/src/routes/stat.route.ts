import { Router } from "express";
import {stats} from "../controllers/stat.controller"

const router = Router();

router.get('/:code/stats',stats);

export default router;