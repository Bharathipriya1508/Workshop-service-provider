import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    serviceType: { type: String, required: true }, // e.g., Car Wash, Mechanic, Painting
    experience: { type: String },
    location: { type: String, required: true },
    description: { type: String },
    availability: { type: Boolean, default: true },
    approved: { type: Boolean, default: false }, // Admin approval
  },
  { timestamps: true }
);

const Provider = mongoose.model("Provider", providerSchema);
export default Provider;