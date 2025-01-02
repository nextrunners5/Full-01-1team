import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteMultipleProjects
} from "../controllers/projectController";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/delete-multiple", deleteMultipleProjects);

export default router; 