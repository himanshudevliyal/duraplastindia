"use strict";
import categoryModel from "./models/category.model.js";
import userModel from "./models/user.model.js";
import BlogModel from "./models/blog.model.js";
import cityBlogModel from "./models/city-blog.model.js";
import productPageModel from "./models/product-page.model.js";
import channelPartnersModal from "./models/channel-partners.modal.js";
import enquiryModal from "./models/enquiry.modal.js";

export default {
  UserModel: userModel,
  BlogModel: BlogModel,
  CategoryModel: categoryModel,
  CityBlogModel: cityBlogModel,
  ProductPageModel: productPageModel,
  ChannelPartnerModel: channelPartnersModal,
  EnquiryModel: enquiryModal,
};
