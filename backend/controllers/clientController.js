import Client from "../models/Client.js";

export const getClients = async (req, res) => {
  const clients = await Client.find().sort({ createdAt: -1 });
  res.json(clients);
};

export const getClientById = async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json(client);
};

export const createClient = async (req, res) => {
  const client = await Client.create(req.body);
  res.status(201).json(client);
};

export const updateClient = async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json(client);
};

export const deleteClient = async (req, res) => {
  const client = await Client.findByIdAndDelete(req.params.id);

  if (!client) {
    res.status(404);
    throw new Error("Client not found");
  }

  res.json({ message: "Client deleted successfully" });
};
