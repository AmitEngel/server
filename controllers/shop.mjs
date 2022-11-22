import { Cart } from '../models/cart.js';
import { Item } from '../models/item.js';
import { Order } from '../models/order.js';
import express from 'express'
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const getItems = (req, res, next) => {
    const allItems = Item.find()
    allItems.then(items => {
        res.status(200).json({
            messege: 'items fetched successfully',
            items: items
        })
    })
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const addItemToShop = (req, res) => {
    //const url = req.protocol + '://' + req.get("host")
    const item = new Item({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        imagePath: "/images/" + req.file.filename,
    })
    item.save().then(newItem => {
        res.status(201).json({
            messege: "Item added successfully!",
            item: {
                id: newItem._id,
                name: newItem.name,
                price: newItem.price,
                category: newItem.category,
                imagePath: newItem.imagePath
            }
        })
    }).catch(error => {
        res.status(500).json({
            message: "Adding Item Failed!"
        })
    })
}

const updateItem = (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        //const url = req.protocol + '://' + req.get("host")
        imagePath = "/images/" + req.file.filename
    }
    const item = new Item({
        _id: req.body._id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        imagePath: imagePath,
    })
    Item.updateOne({ _id: req.params.itemId }, item)
        .then(result => {
            if (result.matchedCount > 0) {
                res.status(200).json({
                    message: "Update successful!"
                })
            } else {
                res.status(401).json({
                    message: "Not Authorized!!"
                })
            }
        }).catch(error => {
            res.status(500).json({
                message: "Couldn't update item.."
            })
        })
}


/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteItem = (req, res) => {
    const item = req.params.itemId;
    const deleted = Item.deleteOne({ _id: item })
    deleted.then(deleteData => {
        return res.status(200).json({
            message: 'Delete successful'
        })
    }).catch(err => {
        return res.status(500).json({message: 'Delete failed!'})
    })
}

/**
 * 
 * @param {express.Request} req
 * @param {express.Response} res
 */

const createCart = (req, res) => {
    const cart = new Cart({
        dateCreated: req.body.dateCreated,
        owner: req.userData.userId
    })
    cart.save()
    return res.status(200).json(cart)
}


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res
 */
const getItemById = (req, res) => {
    Item.findById(req.params.itemId).then(item => {
        if (item) {
            res.status(200).json(item)
        } else {
            res.status(404).json({ message: "Item not found!" })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching Item failed!."
        })
    })
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res
 */
const getCart = (req, res) => {
    const cart = Cart.find({ owner: req.userData.userId }).limit(1).sort({ dateCreated: -1 })
    cart.then(([cart]) => {
        if (cart && cart.items.length > 0) {
            return res.status(200).json(cart)
        } else {
            const newCart = new Cart({
                dateCreated: new Date(),
                owner: req.userData.userId
            })
            newCart.save()
            return res.status(200).json(newCart)
        }
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ message: err })
    })
}

const checkIfItemExists = async (itemId, cartId) => {
    const [{ items }] = await Cart.find({ _id: cartId }).select({
        items: 1,
        _id: 0
    })
    if (items.length > 0) {
        return items.find(item => item.itemId === itemId)
    } else return null
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const addItemToCart = async (req, res) => {
    const cartId = req.params.cartId
    const itemExist = await checkIfItemExists(req.body.itemId, cartId)
    if (itemExist) {
        await Cart.updateOne({
            _id: cartId,
            "items.itemId": req.body.itemId
        },
            {

                "items.$.quantity": itemExist.quantity + req.body.quantity,
                "items.$.priceTotal": itemExist.priceTotal + req.body.priceTotal

            })
    } else {
    const added = await Cart.updateOne(
            { _id: cartId },
            { $push: { items: req.body } }
        )
    }
    return res.status(200).json(req.body)
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteItemFromCart = (req, res) => {
    const cartId = req.params.cartId;
    const itemId = req.params.itemId;
    const deleted = Cart.updateOne(
        {
            _id: cartId,
            "items.itemId": itemId
        },
        { $pull: { "items": { "itemId":itemId } } },
    )
    deleted.then(responseData => {
        return res.status(200).json({message: 'delete successfull', item:responseData})    
    }).catch(err => {
        return res.status(500).json({message: err})
    })
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getOrdersByUserId = (req, res) => {
    const getAllOrders = Order.find({ owner: req.userData.userId })
    getAllOrders.then(orders => {
        return res.status(200).json({
            message: 'Orders fetched Successfully',
            orders: orders
        })
    }).catch(err => {
        return res.status(500).json({
            message: 'Fetching Orders Failed!',
            error: err
        })
    })

}


/**
 * 
 * @param {express.Request} res 
 * @param {express.Response} req 
 */
const orderItems = (req, res) => {
    const order = req.body;
    Order.insertMany(order).then(response => {
        return res.status(200).json(order)
    }).catch(err => {
        res.status(500).json({ message: err })
    })
}

export {
    getItems,
    getItemById,
    addItemToShop,
    updateItem,
    deleteItem,
    getCart,
    createCart,
    addItemToCart,
    deleteItemFromCart,
    getOrdersByUserId,
    orderItems
}