import { BookOpenText, Box, LayoutDashboard, User, Users } from "lucide-react";

const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const sidebarData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [],
  },
  {
    title: "Users",
    url: "/users?page=1&limit=10",
    icon: Users,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "Create",
        url: "/users/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Edit",
        url: "/users/:id/edit",
        roles: [ROLES.ADMIN],
        isVisible: false,
      },
    ],
  },
  {
    title: "Blogs",
    url: "/blogs?page=1&limit=10",
    icon: Box,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "Create",
        url: "/blogs/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Edit",
        url: "/blogs/:id/edit",
        roles: [ROLES.ADMIN],
        isVisible: false,
      },
    ],
  },
  // {
  //   title: "City pages",
  //   url: "/cities?page=1&limit=10",
  //   icon: Box,
  //   roles: [ROLES.ADMIN],
  //   isVisible: true,
  //   items: [
  //     {
  //       title: "Create",
  //       url: "/cities/create",
  //       roles: [ROLES.ADMIN],
  //       isVisible: true,
  //     },
  //     {
  //       title: "Edit",
  //       url: "/cities/:id/edit",
  //       roles: [ROLES.ADMIN],
  //       isVisible: false,
  //     },
  //   ],
  // },
  {
    title: "Product pages",
    url: "/product-pages?page=1&limit=10",
    icon: Box,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "Create",
        url: "/product-pages/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Edit",
        url: "/product-pages/:id/edit",
        roles: [ROLES.ADMIN],
        isVisible: false,
      },
    ],
  },
  {
    title: "Categories",
    url: "/categories?page=1&limit=10",
    icon: BookOpenText,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "Create",
        url: "/categories/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Edit",
        url: "/categories/:id/edit",
        roles: [ROLES.ADMIN],
        isVisible: false,
      },
    ],
  },

  {
    title: "Channel Partners",
    url: "/channel-partners?page=1&limit=10",
    icon: BookOpenText,
    roles: [ROLES.ADMIN],
    isVisible: true,
    items: [
      {
        title: "Create",
        url: "/channel-partners/create",
        roles: [ROLES.ADMIN],
        isVisible: true,
      },
      {
        title: "Edit",
        url: "/channel-partners/:id/edit",
        roles: [ROLES.ADMIN],
        isVisible: false,
      },
    ],
  },
  {
    title: "Profile Overview",
    url: "/profile",
    icon: User,
    roles: [],
    isVisible: true,
    items: [],
  },
];

export const publicRoutes = ["/", "/admin", "/register", "/flipbook"];
