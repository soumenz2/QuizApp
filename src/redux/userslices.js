
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUserId } = userSlice.actions;

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(clearUserId());
};

export default userSlice.reducer;

