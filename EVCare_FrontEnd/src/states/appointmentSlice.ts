import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppointmentState } from "../models/States/AppointmentState";
import type {
  PageModel,
  StaffAppointmentsDto,
} from "../models/AppointmentsModel/Staff_Appointments_Model";

const initialState: AppointmentState = {
  items: [],
  pageSize: 10,
  pageIndex: 1,
  totalItems: 0,
  totalPages: 0,
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: "appoinments",
  initialState,
  reducers: {
    setAppointments(
      state,
      action: PayloadAction<PageModel<StaffAppointmentsDto>>
    ) {
      state.items = action.payload.items ?? [];
      state.pageSize = action.payload.pageIndex;
      state.pageIndex = action.payload.pageIndex;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setAppointments, setLoading, setError } =
  appointmentsSlice.actions;

export default appointmentsSlice.reducer;
