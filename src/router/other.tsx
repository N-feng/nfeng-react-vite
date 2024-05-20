import Layout from "../layouts";
import ErrorPage from "../pages/error-page";
import OrderPage from "../pages/order";
import { SettingPage } from "../pages/setting";
import { SettingCreate } from "../pages/setting/components/CreateForm";
import { SettingUpdate, settingLoader,  } from "../pages/setting/components/UpdateForm";
import { TablePage } from "../pages/table";

export const OtherRoute = {
  path: "/other",
  element: <Layout />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "table",
      element: <TablePage />,
    },
    {
      path: "order",
      element: <OrderPage />,
    },
    {
      path: "setting/list",
      element: <SettingPage />,
    },

    {
      path: "setting/create",
      element: <SettingCreate />,
    },
    {
      path: "setting/update/:id",
      element: <SettingUpdate />,
      loader: settingLoader,
    },
  ]
}