import dataSource from "../db/db.js";
import Product from "../entities/products.js";
import User from "../entities/users.js";
import ProdImage from "../entities/productImages.js";

const productRepo = dataSource.getRepository("Product");
const userRepo = dataSource.getRepository("User");
const prodImgRepo = dataSource.getRepository("ProdImage");

export const createProduct = async (req, res) => {
  try {
    console.log(req.files);

    if (!req.files || req.files.length === 0) {
      return res.send("No images uploaded");
    }

    const { title, description, serialNumber, price, quantity } = req.body;
    const userId = req.userId;

    if (!title || !description || !serialNumber || !price || !quantity) {
      return res.send("All fields are required");
    }

    const existingProduct = await productRepo.findOne({
      where: { serial_number: serialNumber },
    });
    if (existingProduct) {
      return res.send("Product already exists!");
    }

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.send("User not found");
    }

    const newProduct = productRepo.create({
      title,
      description,
      serial_number: serialNumber,
      price,
      quantity,
      user,
    });
    await productRepo.save(newProduct);
    console.log("Saved product: ", newProduct);

    for (let file of req.files) {
      const productImage = prodImgRepo.create({
        image_url: file.path,
        image: newProduct,
      });
      await prodImgRepo.save(productImage);
    }

    return res.json({
      success: true,
      message: "Product created with images",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};

export const updateProduct = async (req, res) => {
  try {
    console.log(req.files);
    const files = req.files;
    console.log(req.body);

    const { id, title, description, serialNumber, price, quantity } = req.body;
    const userId = req.userId;

    console.log("ID:", id, userId);
    if (!id) {
      return res.send("Id must be required!");
    }

    const productToUpdate = await productRepo.findOne({
      where: { id },
      relations: ["user", "prodimage"],
    });

    console.log(productToUpdate);
    console.log(productToUpdate.user.id, userId);

    if (title !== undefined && title !== "") productToUpdate.title = title;
    if (description !== undefined && description !== "")
      productToUpdate.description = description;
    if (serialNumber !== undefined && serialNumber !== "")
      productToUpdate.serial_number = serialNumber;
    if (price !== undefined && price !== "") productToUpdate.price = price;
    if (quantity !== undefined && quantity !== "")
      productToUpdate.quantity = quantity;

    await productRepo.save(productToUpdate);

    if (files) {
      for (let i = 0; i < productToUpdate.prodimage.length; i++) {
        if (req.files[i]) {
          productToUpdate.prodimage[i].image_url = req.files[i].path;
          await prodImgRepo.save(productToUpdate.prodimage[i]);
        }
      }
    }

    return res.json({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const products = await productRepo.find({
      relations: ["prodimage"],
    });

    console.log(products);
    return res.send(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const fetchProductsByUserId = async (req, res) => {
  try {
    console.log(req.params.id);
    const products = await productRepo.find({
      where: { user: { id: req.params.id } },
      relations: ["user", "prodimage"],
    });

    if (!products) return res.json({ message: "Not found" });

    console.log("User's products:", products);
    return res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productRepo.findOne({
      where: { id: req.params.id },
      relations: ["prodimage"],
    });

    if (!product) return res.json({ message: "Not found" });

    await productRepo.remove(product);
    return res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
