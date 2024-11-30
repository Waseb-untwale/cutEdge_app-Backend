const Blog = require('../models/BlogModel');
const fs = require("fs")

const userCtrl = {
  addNews: async (req, res) => {
    const { title, slug, category, description, body, date, isNewCategory } = req.body;
    const image = req.file
    // console.log(req.file);
    const imageurl = {
      url: `/${image.destination}${image?.filename}`,
      path: image?.path
    }
    try {
      const newBlog = new Blog({
        ...req.body,
        image: imageurl
      });
      await newBlog.save();
      res.status(201).json({
        status: true,
        message: "Blog post created!",
        blog: newBlog
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({status: false, message: "Error creating blog post" });
    }
  },

  getNews: async (req, res) => {
    const { category, search, page = 1, limit = 10 } = req.query;

    try {
      const query = {};

      // Apply category filter if provided
      if (category) {
        query.category = new RegExp(category, 'i'); // Case-insensitive match
      }

      // Apply search filter if provided
      if (search) {
        query.title = new RegExp(search, 'i'); // Case-insensitive match
      }

      // Pagination logic
      const skip = (page - 1) * limit;
      const total = await Blog.countDocuments(query);
      const blogs = await Blog.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt : -1}); // Sort by date, most recent first

      // Modify image path for frontend
      const blogsWithImages = blogs.map((blog) => ({
        ...blog._doc,
        image: `/uploads/${blog.image}`,
      }));

      res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        blogs: blogs,
      });
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

    try {
        // Find the existing blog post
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Handle new image upload
        if (req.file) {
            // Delete the old image if it exists
            if (blog.image?.path) {
                fs.unlink(blog.image.path, (err) => {
                    if (err) {
                        console.error("Error deleting old image:", err);
                    }
                });
            }

            // Normalize the new image path and URL for consistency
            updateData.image = {
                url: `/uploads/${req.file.filename}`,
                path: `uploads\\${req.file.filename}`,
            };
        } else {
            // Retain the existing image if no new image is provided
            updateData.image = blog.image;
        }

        // Update the blog post
        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            message: "Blog post updated successfully!",
            blog: {
                ...updatedBlog._doc, // Extract Mongoose document fields
                image: updatedBlog.image, // Ensure image data is properly returned
            },
        });
    } catch (err) {
        console.error("Error updating blog post:", err);
        res.status(500).json({ message: "Error updating blog post" });
    }
},


  getBlogById: async (req, res) => {
    try {
      const BlogId = req.params.id;
      const blog = await Blog.findById(BlogId);

      if (!blog) {
        return res.status(404).json({ msg: "Blog Not Found" });
      }
      res.json(blog);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      const deleteId = req.params.id;

      const findblog = await Blog.findById(deleteId);
      // console.log(findblog)
      if(findblog){
        const fpath = findblog?.image?.path
          console.log(fpath ,findblog)
        if(findblog?.image){
          fs.unlink(fpath , (err)=>{
            if(err){
               res.status(500).json({err, 
                message:"error occured "
            })
            }
              
          })
        }
        
        const deleteBlog = await Blog.findByIdAndDelete(deleteId);
       
        res.status(200).json({ status:true , msg: "Deleted Blog Successfully" ,deleteBlog });
      }else{
         res.status(404).json({ msg: "Blog not found" });

      }

    } catch (err) {
      res.status(500).json({ msg: "Server Error" });
    }
  },
};

module.exports = userCtrl;
