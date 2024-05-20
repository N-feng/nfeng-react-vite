import Layout from "../layouts";
import ErrorPage from "../pages/error-page";
import { ProductCreate } from "../pages/product/components/CreateForm";
import {
  ProductUpdate,
  loader as productLoader,
} from "../pages/product/components/UpdateForm";
import { ProductCatePage } from "../pages/product-cate";

export const ProductCate = {
  path: "/productCate",
  element: <Layout />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "list",
      element: <ProductCatePage />,
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
  ]
}