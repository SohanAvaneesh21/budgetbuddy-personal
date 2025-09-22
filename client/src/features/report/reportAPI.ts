import { apiClient } from "@/app/api-client";
import { GetAllReportResponse, UpdateReportSettingParams, GenerateReportResponse } from "./reportType";

export const reportApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    
    getAllReports: builder.query<GetAllReportResponse, {pageNumber: number, pageSize: number}>({
      query: (params) => {
        const { pageNumber = 1, pageSize = 20 } = params;
        return ({
          url: "/report/all",
          method: "GET",
          params: { pageNumber, pageSize },
        });
      },
    }),

    generateReport: builder.query<GenerateReportResponse, {from: string, to: string}>({
      query: (params) => ({
        url: "/report/generate",
        method: "GET",
        params,
      }),
    }),

    updateReportSetting: builder.mutation<void, UpdateReportSettingParams>({
      query: (payload) => ({
        url: "/report/update-setting",
        method: "PUT",
        body: payload,
      }),
    }),

    emailReport: builder.mutation<{ message: string }, {from: string, to: string}>({
      query: (payload) => ({
        url: "/report/email",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
    useGetAllReportsQuery,
    useGenerateReportQuery,
    useLazyGenerateReportQuery,
    useUpdateReportSettingMutation,
    useEmailReportMutation
} = reportApi;
