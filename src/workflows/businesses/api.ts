import {ApiUtils, makeParams, TApiResponse} from '@/src/common/lib/ApiUtils';
import {API_URL} from '@/src/common/lib/endpoints';

export interface TLocation {
    coordinates: number[];
    type: string;
}

export interface TAddress {
    location: Location;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postCode: string;
}

export interface TOpenHour {
    dayOfWeek: number;
    openTill: string;
    openFrom: string;
    _id: string;
}

export interface TBusiness {
    address: TAddress;
    _id: string;
    businessName: string;
    businessMobile: string;
    ownerName: string;
    categoryId: string;
    atMyPlace: boolean;
    atClientPlace: boolean;
    travelFees?: any;
    openHours: TOpenHour[];
    deleted: boolean;
    recommended: boolean;
    images: string[];
    portfolioImages: any[];
    belongTo: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    businessLogo: string;
    updatedById: string;
    description: string;
    businessCover: string;
}

export interface TBusinessDetails {
    _id: string;
    businessName: string;
    address: TAddress;
}

export interface TDuration {
    hours: number;
    minutes: number;
}

export interface TServiceDetails {
    _id: string;
    businessId: string;
    name: string;
    description: string;
    categoryId: string;
    duration: TDuration;
    price: number;
    allowedSeats: number;
    gender: string;
    createdById: string;
    __v: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TService {
    start: Date;
    end: Date;
    serviceDetails: TServiceDetails;
}

export interface TBookingsResponse {
    _id: string;
    status: string;
    businessDetails: TBusinessDetails;
    note: string;
    bookingId: number;
    createdAt: Date;
    updatedAt: Date;
    email?: any;
    name: string;
    services: TService[];
}


// ---

export interface Appointment {
    _id: string;
    bookingId: number;
    status: string;
    services: TServices;
    note: string;
    email: string;
    name: string;
    timezone: string;
    staffUserId: string;
    createdAt: Date;
    updatedAt: Date;
    businessDetails: TBusinessDetails;
}

export interface TUpcomingBookingsResponse {
    date: string;
    appointments: Appointment[];
}

// --

export interface TServices {
    start: Date;
    end: Date;
    serviceDetails: TServiceDetails;
}

export interface TBookingsOnDate {
    _id: string;
    bookingId: number;
    status: string;
    services: TServices;
    note: string;
    email: string;
    name: string;
    timezone: string;
    staffUserId: string;
    createdAt: Date;
    updatedAt: Date;
    businessDetails: TBusinessDetails;
}

export interface TStaff {
    name: string;
    gender: string;
    userId: string;
    businessId: string;
}

export interface BookingIdToStaffDetailsMap {
    [staffId: string]: TStaff;
}

export interface TBookingsOnDateResponse {
    res: TBookingsOnDate[];
    bookingIdToStaffDetailsMap: BookingIdToStaffDetailsMap;
}

export const getAllBiz = (params: {skip: number, limit: number}) => {
    return ApiUtils.makeGetRequestUnsafe<TApiResponse<TBusiness[]>>(
        API_URL + '/bkmiadmin/biz/all' + makeParams(params),
    )
};

export const getAllBookings = (params: {businessId: string}) => {
    return ApiUtils.makeGetRequestUnsafe<TApiResponse<TBookingsResponse[]>>(
        API_URL + '/bkmiadmin/biz/bookings' + makeParams(params)
    )
}

export const getUpcomingBookings =(params: {businessId: string}) => {
    return ApiUtils.makeGetRequestUnsafe<TApiResponse<TUpcomingBookingsResponse[]>>(
        API_URL + '/bkmiadmin/biz/bookings/upcoming' + makeParams(params),
    )
}

export const getBookingsByDate =(params: {businessId: string, date: string}) => {
    return ApiUtils.makeGetRequestUnsafe<TApiResponse<TBookingsOnDateResponse>>(
        API_URL + '/bkmiadmin/biz/bookings/date' + makeParams(params),
    )
}
