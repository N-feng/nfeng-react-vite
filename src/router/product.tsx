import Layout from "../layouts";
import ErrorPage from "../pages/error-page";
import { ProductPage } from "../pages/product";
import { ProductCreate } from "../pages/product/components/CreateForm";
import {
  ProductUpdate,
  loader as productLoader,
} from "../pages/product/components/UpdateForm";
import { ProductCatePage } from "../pages/product-cate";

export const Product = {
  path: "/product",
  element: <Layout />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "list",
      element: <ProductPage />,
    },
    {
      path: "create",
      element: <ProductCreate />,
    },
    {
      path: "update/:id",
      element: <ProductUpdate />,
      loader: productLoader,
    },
    {
      path: "category",
      element: <ProductCatePage />,
    },
  ]
}