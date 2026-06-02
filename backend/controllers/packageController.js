const Package = require('../models/Package');

const getPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ price: 1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPackage = async (req, res) => {
  try {
    const { name, description, price, durationMinutes } = req.body;
    const pkg = await Package.create({ name, description, price, durationMinutes });
    res.status(201).json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    const { name, description, price, durationMinutes } = req.body;
    pkg.name = name ?? pkg.name;
    pkg.description = description ?? pkg.description;
    pkg.price = price ?? pkg.price;
    pkg.durationMinutes = durationMinutes ?? pkg.durationMinutes;
    const updated = await pkg.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    await pkg.deleteOne();
    res.json({ message: 'Package removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPackages, createPackage, updatePackage, deletePackage };
