const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');

// Create a new category
router.post('/', async (req, res) => {
  try {
    const { name, slug } = req.body;
    const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category name or slug already exists' });
    }

    const newCategory = new Category({ name, slug });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a category by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, status } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug, status }, // Correct field names
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error('Error updating category:', err.message); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async(req,res)=>{
  try{
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId)

  if(!category){
    return res.status(404).json({msg:"Category not found"})
  }
  res.json(category)
}
catch(err){
  console.error(err.message)
  res.status(500).json({msg:"Server error"})
}
})

// Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
