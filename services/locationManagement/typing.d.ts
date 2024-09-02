type Division = {
  id: number;
  title_en: string;
  title: string;
  bbs_code: string;
  row_status: string;
};

type District = {
  id: number;
  title_en: string;
  title: string;
  bbs_code: string;
  loc_division_id: number;
  row_status: string;
};

type Upazila = {
  id: number;
  title_en?: string | undefined;
  title: string;
  bbs_code: string;
  loc_division_id: number;
  loc_district_id: number;
  row_status?: string;
  type_of?: number;
};
