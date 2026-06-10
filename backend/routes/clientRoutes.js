import express from "express";

import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.route("/").get(getClients).post(createClient);
router.route("/:id").get(getClientById).put(updateClient).delete(deleteClient);

export default router;
