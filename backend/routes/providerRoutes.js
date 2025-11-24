import express from "express";
import {
  registerProvider,
  loginProvider,
  getProviders,
  getProviderById,
  updateProviderStatus,
  updateProviderProfile,
  deleteProvider,
  getProvidersByServiceType,
  getAvailableProviders
} from "../controllers/providerController.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerProvider);
router.post("/login", loginProvider);

// Provider data routes
router.get("/", getProviders);
router.get("/available", getAvailableProviders);
router.get("/service/:serviceType", getProvidersByServiceType);
router.get("/:id", getProviderById);

// Provider management routes
router.put("/:id/status", updateProviderStatus);
router.put("/:id/profile", updateProviderProfile);
router.delete("/:id", deleteProvider);

export default router;
