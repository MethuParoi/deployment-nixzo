import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/auth/userSlice";
import sortProductReducer from "./features/sort-products/sortProductSlice";
import cartReducer from "./features/cart/cartSlice";
import checkoutReducer from "./features/checkout/checkout";
import productReducer from "./features/products/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    sortProduct: sortProductReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
