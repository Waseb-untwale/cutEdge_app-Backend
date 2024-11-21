const Blog = require('../models/BlogModel');

const userCtrl = {
  addNews: async (req, res) => {
    const { title, slug, category, description, body, date, isNewCategory } = req.body;
    const image = req.file ? req.file.filename : null; // Store only the filename, not the full path

    try {
      const newBlog = new Blog({
        title,
        slug,
        category,
        description,
        body,
        date,
        image,
        isNewCategory,
      });

      await newBlog.save();

      
      res.status(201).json({
        message: "Blog post created!",
        blog: {
          ...newBlog._doc, 
          image: `/uploads/${newBlog.image}`  // Send the image path as a URL (relative path)
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating blog post" });
    }
  },
  getNews: async (req, res) => {
    try {
      const blogs = await Blog.find();
      
      // Modify image path in the response to be relative
      const blogsWithImages = blogs.map(blog => {
        return {
          ...blog._doc,
          image: `/uploads/${blog.image}`  // Provide image URL for frontend (relative path)
        };
      });

      res.status(200).json(blogsWithImages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  },

  updateNews: async (req, res) => {
    const { id } = req.params;
    const { title, slug, category, description, body, date, isNewCategory } = req.body;
  
    const updateData = {
      title,
      slug,
      category,
      description,
      body,
      date,
      isNewCategory,
    };
  
    if (req.file) {
      // If new file is uploaded, update the image path
      updateData.image = req.file.filename;
    }
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({
        message: "Blog post updated successfully!",
        blog: {
          ...updatedBlog._doc,
          image: `/uploads/${updatedBlog.image}`, // Correct the image path for the frontend
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating blog post" });
    }
  },
  
  getBlogById: async(req,res)=>{
    try{
      const BlogId = req.params.id;
      const blog = await Blog.findById(BlogId)
   
      if(!blog){
       res.status(404).json({msg:"Blog Not Find"})
      }
      res.json(blog)
     }
     catch(err){
      res.json(500).json({msg:"server error"})
     }
    },

    deleteBlog: async(req,res)=>{
      try{
        const deleteId = req.params.id;
        const deleteBlog = await Blog.findByIdAndDelete(deleteId)
   
        if(!deleteBlog){
         res.status(404).json({msg:"Blog not found"})
        }
        res.json({msg:"Deleted Blog Successfully"})
      }
      catch(err){
        res.status(500).json({msg:"server Error"})
      }
    
    }
   
};

module.exports = userCtrl;
