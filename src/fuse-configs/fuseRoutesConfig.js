import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse/index';
import { LoginConfig } from 'main/content/login/LoginConfig';
import { LogoutConfig } from 'main/content/logout/LogoutConfig';
import { DashboardConfigs } from 'main/content/dashboard/DashboardConfigs';
import { UserManagementConfig } from 'main/content/userManagement/UserManagementConfig';
import { MenuConfigs } from 'main/content/menu/MenuConfigs';
import { CustomerConfigs } from 'main/content/customer/customerConfigs';
import { ChefConfigs } from 'main/content/chef/chefConfigs';
import { DeliveryPersonConfigs } from 'main/content/deliveryPerson/deliveryPersonConfigs';
import { OrderListConfigs } from 'main/content/order/orderConfigs';
import { DeliveryListConfigs } from 'main/content/deliveryList/deliveryListConfigs';
import { CartConfigs } from 'main/content/cart/cartConfigs';


const routeConfigs = [
  DashboardConfigs,
  LoginConfig,
  LogoutConfig,
  ...UserManagementConfig,
  ...MenuConfigs,
  CustomerConfigs,
  ChefConfigs,
  DeliveryPersonConfigs,
  OrderListConfigs,
  DeliveryListConfigs,
  CartConfigs

];

export const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: '/',
    component: () => <Redirect to="/dashboard" />,
  },
];
