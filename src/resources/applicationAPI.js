const xyzServer = 'http://localhost:7080';
const xyzAuthServer = 'http://localhost:7070';

const applicationAPI = {

  getUserRoles: `${xyzAuthServer}/roles/getAllRoles`,
  getCustomers: `${xyzServer}/customer/getCustomers`,
  saveCustomer: `${xyzServer}/customer/saveCustomers`,
  saveChef: `${xyzServer}/chef/saveChef`,
  getChefs: `${xyzServer}/chef/getChefs`,
  getDeliveryPersons: `${xyzServer}/deliveryPerson/getDeliveryPersons`,
  saveDeliveryPerson: `${xyzServer}/deliveryPerson/saveDeliveryPerson`,
  getItemByID: `${xyzServer}/item/getItemByID`,
  saveToCart: `${xyzServer}/cart/saveToCart`,
  getCardDetails: `${xyzServer}/cart/getCardDetails`,
  deleteCartRecord: `${xyzServer}/cart/deleteCartRecord`,
  updateCart: `${xyzServer}/cart/updateCart`,
  updateCartByItemCustomer: `${xyzServer}/cart/updateCartByItemCustomer`,
  saveOrder: `${xyzServer}/order/saveOrder`,
  sendMail: `${xyzServer}/order/sendMail`,
  updateCustomer: `${xyzServer}/customer/updateCustomer`,
  deleteCustomer: `${xyzServer}/customer/deleteCustomer`,
  updateChefs: `${xyzServer}/chef/updateChefs`,
  deleteChef: `${xyzServer}/chef/deleteChef`,
  getLastOrder: `${xyzServer}/order/getLastOrder`,

};

export default applicationAPI;
