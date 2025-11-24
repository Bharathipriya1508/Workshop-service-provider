import Provider from "../models/providerModel.js";
import bcrypt from "bcryptjs";

// Register a new service provider
export const registerProvider = async (req, res) => {
  try {
    const { name, email, phone, serviceType, location, experience, description, password } = req.body;

    // Check if provider already exists
    const providerExists = await Provider.findOne({ email });
    if (providerExists) {
      return res.status(400).json({ message: "Provider already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create provider - NO ADMIN APPROVAL NEEDED
    const provider = await Provider.create({
      name,
      email,
      phone,
      serviceType,
      location,
      experience,
      description,
      password: hashedPassword,
      availability: true,
      approved: true, // Auto-approved
    });

    // Return provider without password
    const { password: _, ...providerWithoutPassword } = provider.toObject();
    
    res.status(201).json({
      message: "Provider registered successfully!",
      provider: providerWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login provider
export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if provider exists
    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // ✅ NO ADMIN APPROVAL CHECK - Providers can login immediately

    // Check password
    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return provider without password
    const { password: _, ...providerWithoutPassword } = provider.toObject();
    
    res.status(200).json({ 
      message: "Login successful", 
      provider: providerWithoutPassword,
      token: "provider-jwt-token"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all service providers
export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find().select('-password');
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single provider by ID
export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).select('-password');
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update provider status (active/inactive)
export const updateProviderStatus = async (req, res) => {
  try {
    const { status, availability } = req.body;
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update fields based on what's provided
    if (typeof availability !== 'undefined') {
      provider.availability = availability;
    }
    if (status) {
      provider.availability = status === 'active';
    }

    await provider.save();

    // Return provider without password
    const { password: _, ...updatedProvider } = provider.toObject();

    res.status(200).json({ 
      message: "Provider status updated successfully", 
      provider: updatedProvider 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update provider profile
export const updateProviderProfile = async (req, res) => {
  try {
    const { name, phone, serviceType, location, experience, description } = req.body;
    const provider = await Provider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Update fields
    if (name) provider.name = name;
    if (phone) provider.phone = phone;
    if (serviceType) provider.serviceType = serviceType;
    if (location) provider.location = location;
    if (experience) provider.experience = experience;
    if (description) provider.description = description;

    await provider.save();

    // Return provider without password
    const { password: _, ...updatedProvider } = provider.toObject();

    res.status(200).json({ 
      message: "Profile updated successfully", 
      provider: updatedProvider 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete provider
export const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({ message: "Provider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get providers by service type
export const getProvidersByServiceType = async (req, res) => {
  try {
    const { serviceType } = req.params;
    const providers = await Provider.find({ 
      serviceType: new RegExp(serviceType, 'i'),
      availability: true // No approval filter needed
    }).select('-password');

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available providers
export const getAvailableProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ 
      availability: true // No approval filter needed
    }).select('-password');

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};