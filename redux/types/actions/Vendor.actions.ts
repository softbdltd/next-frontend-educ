export const UPDATE_VENDOR_INFORMATION = 'UPDATE_VENDOR_INFORMATION';
export const VENDOR_LOADED = 'VENDOR_LOADED';

export interface UpdateVendorInformationActions {
  type: typeof UPDATE_VENDOR_INFORMATION;
  payload: any;
}

export interface VendorLoadedActions {
  type: typeof VENDOR_LOADED;
}

export type VendorActions =
  | UpdateVendorInformationActions
  | VendorLoadedActions;
