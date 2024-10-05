import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface productState {
  product: string;
}

let product = "";

const initialState: productState = {
  product,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.product = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCategory } = productSlice.actions;

export default productSlice.reducer;
