import { Router } from "express";
import { ROLES_LIST } from "../authorization/roles";
import { postOrganization, getOrganization } from "../controllers/organization"
import { authenticateToken } from "../middlewares/authenticateToken";
import { verifyRoles } from "../middlewares/verifyRoles";

export const router = Router();

router.post("/",authenticateToken, postOrganization)
router.get("/:id", authenticateToken, verifyRoles(ROLES_LIST.Admin), getOrganization)