const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");
const Studio = require("twilio/lib/rest/Studio");

module.exports = {
  adminLogin: async (email) => {
    try {
      let data = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .find({ email: email })
        .toArray();
      if (data.length) return data;
    } catch (err) {
      return err;
    }
  },

  addProduct: async (data, files) => {
    try {
      let { productname, description, model, price, category } = data;

      let obj = {
        productname,
        description,
        model,
        price: parseFloat(price),
        images: {},
        category,
      };
      for (let i = 0; i < files.length; i++) {
        obj.images[`image${i + 1}`] = files[i].path;
      }
      return await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .insertOne(obj);
    } catch (err) {
      return err;
    }
  },
  getProduct: async () => {
    try {
      let productData = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      return productData;
    } catch (err) {
      return err;
    }
  },

  editProduct: async (id) => {
    try {
      let document = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ _id: ObjectId(id) })
        .toArray();
      let category = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .find({})
        .toArray();

      return {
        document: document,
        category: category,
      };
    } catch (err) {
      return err;
    }
  },

  upDateProduct: async (id, obj) => {
    try {
      let status = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne({ _id: ObjectId(id) }, { $set: obj });
      if (status) {
        return "success";
      } else {
        return "error";
      }
    } catch (err) {
      return err;
    }
  },
  deleteProduct: async (id) => {
    try {
      let status = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: ObjectId(id) });
      if (status) return "delete success";
      else return "delete failed";
    } catch (err) {
      err;
    }
  },

  /*user details */

  getAllUsers: async () => {
    try {
      let data = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find({})
        .toArray();
      return data;
    } catch (err) {
      return err;
    }
  },

  block: async (id) => {
    try {
      let status = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .updateOne({ _id: ObjectId(id) }, { $set: { active: false } });
      return status;
    } catch (err) {
      return err;
    }
  },

  unBlock: async (id) => {
    try {
      let status = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .updateOne({ _id: ObjectId(id) }, { $set: { active: true } });
      return status;
    } catch (err) {
      return err;
    }
  },
  getAllCategory: async () => {
    try {
      let Digital = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Digital" })
        .toArray();
      let Dress = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Dress" })
        .toArray();
      let GMT = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "GMT" })
        .toArray();
      let Ladies = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Ladies" })
        .toArray();
      let Smart = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Smart" })
        .toArray();
      let Pilot = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Pilot's" })
        .toArray();
      let Dive = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: "Dive" })
        .toArray();

      return {
        Digital: Digital,
        Dress: Dress,
        GMT: GMT,
        Ladies: Ladies,
        Smart: Smart,
        Pilot: Pilot,
        Dive: Dive,
      };
    } catch (err) {
      return err;
    }
  },

  categoryList: async () => {
    try {
      let data = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .find({})
        .toArray();
      return data;
    } catch (err) {
      return err;
    }
  },

  deleteCategory: async (id) => {
    try {
    } catch (err) {
      return err;
    }

    return await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .deleteOne({ _id: ObjectId(id) });
  },

  addCategory: async (obj) => {
    try {
      return await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .insertOne(obj);
    } catch (err) {
      return err;
    }
  },

  orderList: async () => {
    try {
      const orderList = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find({})
        .toArray();
      return orderList;
    } catch (err) {
      return err;
    }
  },

  getOrderDetails: async (id) => {
    try {
      const orderDetails = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find({ _id: ObjectId(id) })
        .toArray();
      return orderDetails;
    } catch (err) {
      return err;
    }
  },

  getUserDetails: async (id) => {
    try {
      const userDetails = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find({ _id: ObjectId(id) })
        .toArray();
      return userDetails;
    } catch (err) {
      return err;
    }
  },

  getAddress: async (id) => {
    try {
      const address = await db
        .get()
        .collection(collection.ADDRESS_COLLECTION)
        .find({ _id: ObjectId(id) })
        .toArray();
      return address;
    } catch (err) {
      return err;
    }
  },

  changeStatus: async (id, status) => {
    try {
      const result = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne({ _id: ObjectId(id) }, { $set: { status: status } });
      return result;
    } catch (err) {
      return err;
    }
  },

  getAllOrders: async () => {
    try {
      const result = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $group: {
              _id: null,
              totalValue: { $sum: "$total" },
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              pipeline: [{ $count: "count" }],
              as: "productCount",
            },
          },
          {
            $project: {
              _id: 0,
              totalValue: 1,
              orderCount: "$count",
              productCount: { $arrayElemAt: ["$productCount.count", 0] },
            },
          },
        ])
        .toArray();
      return result;
    } catch (err) {
      return err;
    }
  },

  getProductName: async () => {
    try {
      let productNames = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .aggregate([
          {
            $project: {
              product: "$productname",
              model: "$model",
            },
          },
        ])
        .toArray();
      return productNames;
    } catch (err) {
      return err;
    }
  },

  applyCatgeoryOffer: async (category, discount) => {
    try {
      let result = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: category })
        .forEach(function (doc) {
          var discountPercentage = discount; // set the discount percentage
          var discountedPrice =
            doc.price - doc.price * (discountPercentage / 100); // calculate the discounted price
          db.get()
            .collection(collection.PRODUCT_COLLECTION)
            .update(
              { _id: doc._id },
              { $set: { discountprice: discountedPrice } }
            ); // update the document with the discounted price
        });

      return result;
    } catch (err) {
      return err;
    }
  },

  applyProductOffer: async (name, discount) => {
    let obj = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find({ productname: name })
      .toArray();

    let price = obj[0].price;

    const result = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { productname: name },
        {
          $set: {
            discountprice: (price * (100 - discount)) / 100,
          },
        },
        { upsert: true }
      );

    return result;
  },

  addCoupon: async (obj) => {
    try {
      await db
        .get()
        .collection(collection.COUPON_COLLECTION)
        .insertOne(obj)
        .then(() => {
          return true;
        });
    } catch (err) {
      return err;
    }
  },

  findRefundRequest: async () => {
    try {
      let request = db
        .get()
        .collection(collection.REFUND_REQUEST_COLLECTION)
        .find({ status: "pending" })
        .toArray();
      return request;
    } catch (err) {
      return err;
    }
  },

  refundStatusChange: async (id, status) => {
    try {
      const result = await db
        .get()
        .collection(collection.REFUND_REQUEST_COLLECTION)
        .findOneAndUpdate(
          { orderId: id },
          { $set: { status: status } },
          { returnOriginal: false }
        );
      return result;
    } catch (err) {
      return err;
    }
  },

  AddtoWallet: async (userId, amount) => {
    try {
      amount = parseFloat(amount);
      let transaction = {
        type: "credit",
        amount: amount,
        date: new Date(),
      };

      let userWallet = await db
        .get()
        .collection(collection.USER_WALLET_COLLECTION)
        .findOne({ userId: userId });

      if (userWallet) {
        await db
          .get()
          .collection(collection.USER_WALLET_COLLECTION)
          .updateOne(
            { userId: userId },
            {
              $push: {
                Transaction: transaction,
              },
              $inc: {
                amount: amount,
              },
            }
          );
        return true;
      } else {
        let wallet = {
          userId: userId,
          amount: amount,
          Transaction: [transaction],
        };

        await db
          .get()
          .collection(collection.USER_WALLET_COLLECTION)
          .insert(wallet);
      }

      return true;
    } catch (err) {
      return err;
    }
  },

  // find monthly Sales

  calculateMonthlySalesForGraph: async () => {
    try {
      const sales = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $group: {
              _id: {
                month: { $month: "$date" },
                year: { $year: "$date" },
              },
              totalRevenue: { $sum: "$total" },
            },
          },
          {
            $project: {
              _id: 0,
              month: "$_id.month",
              year: "$_id.year",
              totalRevenue: 1,
            },
          },
          {
            $sort: {
              year: 1,
              month: 1,
            },
          },
        ])
        .toArray();
      const revenueByMonth = Array(12).fill(0);
      sales.forEach(({ month, totalRevenue }) => {
        revenueByMonth[month - 1] = totalRevenue;
      });

      
    // find monthly visitors

    const visitors = await db
  .get()
  .collection(collection.VISITORS_IP_COLLECTION)
  .aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$visistedDate" },
          month: { $month: "$visistedDate" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        count: 1,
      },
    },
    {
      $sort: {
        year: 1,
        month: 1,
      },
    },
  ])
  .toArray();

const visitorsByMonth = Array(12).fill(0);
visitors.forEach(({ month, count }) => {
  visitorsByMonth[month - 1] = count;
});


const orderStatitics = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
  {
    $group: {
      _id: null,
      placedCount: { $sum: { $cond: [{ $eq: ["$status", "placed"] }, 1, 0] } },
      shippedCount: { $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] } },
      outForDeliveryCount: { $sum: { $cond: [{ $eq: ["$status", "out of delivery"] }, 1, 0] } },
      completedCount: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
      cancelledCount: { $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] } },
      pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
    }
  },
  {
    $project: {
      _id: 0,
      placedCount: 1,
      shippedCount: 1,
      outForDeliveryCount: 1,
      completedCount: 1,
      cancelledCount: 1,
      pendingCount: 1
    }
  }
])
.toArray()







let obj = { revenueByMonth, visitorsByMonth , orderStatitics}


return obj
      
    } catch (error) {
    }
  },

  getCompletedOrders: async () => {
    try {
      let data = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          // Filter the documents with status "Completed"
          { $match: { status: "Completed" } },

          // Lookup the address document for each order
          {
            $lookup: {
              from: "address",
              localField: "address",
              foreignField: "_id",
              as: "address_doc",
            },
          },

          // Unwind the address_doc array
          { $unwind: "$address_doc" },

          // Project the required fields
          {
            $project: {
              orderId: "$_id",
              phoneNumber: "$address_doc.mobile",
              customerName: {
                $concat: ["$address_doc.name", " ", "$address_doc.surname"],
              },
              address: [
                "$address_doc.addressLine1",
                "$address_doc.addressLine2",
                "$address_doc.area",
                "$address_doc.pincode",
                "$address_doc.state",
                "$address_doc.country",
              ],
              paymentMethod: 1,
              date: 1,
              total: 1,
            },
          },
        ])
        .toArray();
      return data;
    } catch (err) {
      return err;
    }
  },

  OrderDetailsWithinRange: async (date1, date2) => {
    try {
      let data = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          // match documents with status 'Completed' within the given date range
          {
            $match: {
              status: "Completed",
              date: {
                $gte: new Date(date1),
                $lte: new Date(date2),
              },
            },
          },
          // join with the address collection
          {
            $lookup: {
              from: "address",
              localField: "address",
              foreignField: "_id",
              as: "address",
            },
          },
          // unwind the address array
          { $unwind: "$address" },
          // project required fields
          {
            $project: {
              orderId: "$_id",
              phoneNumber: "$address.mobile",
              customerName: {
                $concat: ["$address.name", " ", "$address.surname"],
              },
              address: [
                "$address.addressLine1",
                "$address.addressLine2",
                "$address.area",
                "$address.pincode",
                "$address.state",
                "$address.country",
              ],
              paymentMethod: 1,
              date: 1,
              total: 1,
            },
          },
        ]).toArray();

         return data;
    } catch (err) {
      return err;
    }
  },
};
