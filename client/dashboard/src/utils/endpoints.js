export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    username: "/auth/username",
  },
  profile: "/users/me",
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
    deleteKey: "/upload/s3",
    preSignedUrl: "/upload/presigned-url",
    preSignedUrls: "/upload/presigned-urls",
  },
  users: { getAll: "/users" },
  blogs: { getAll: "/blogs" },
  cityBlogs: { getAll: "/city-blogs" },
  categories: { getAll: "/categories" },
  productPages: { getAll: "/product-pages" },
};
