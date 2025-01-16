interface HeroData {
  hero_title: string;
  hero_subtitle_bold: string;
  hero_subtitle_regular: string;
}

interface HomePageData {
  hero_section: HeroData[];
}

type LocationType = {
  location_id: string;
  full_address: string;
  country: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
}

type BlogType = {
  id: string;
  group_id?: string;
  title?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  created_at?: datetime;
  rank?: number;
  enabled?: boolean;
  slug?: string;
}

type BlogGroupType = {
  id: string;
  user_id?: string;
  name?: string;
  rank?: number;
  enabled?: boolean;
  blogs?: BlogType[];
}

type GalleryType = {
  id: string;
  user_id?: string;
  title?: string;
  before_image_url?: string;
  after_image_url?: string;
  before_image_label?: string;
  after_image_label?: string;
  rank?: number;
  created_at?: datetime;
  enabled?: boolean;
}

type ReviewType = {
  id?: string;
  user_id?: string;
  reviewer_name?: string;
  content?: string;
  stars?: number;
  image_url?: string;
  platform?: string;
  rank?: number;
  enabled?: boolean;
  created_at?: datetime;
}

type VideoType = {
  id?: string;
  group_id?: string;
  title?: string;
  link?: string;
  rank?: number;
  enabled?: boolean;
}

type ProductType = {
  id?: string;
  group_id?: string;
  name?: string;
  link?: string;
  platform?: string;
  image_url?: string;
  price?: string;
  currency?: string;
  rank?: number;
  enabled?: boolean;
}

type IndividualProductType = {
  id?: string;
  user_id?: string;
  name?: string;
  link?: string;
  platform?: string;
  image_url?: string;
  price?: string;
  currency?: string;
  rank?: number;
  enabled?: boolean;
}

type GroupType = {
  id: string;
  user_id?: string;
  name?: string;
  rank?: number;
  enabled?: boolean;
  datas?: any[];
}

type UserType = {
  id?: string;
  email?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  username?: string;
  country?: string;
  position?: string;
  title?: string;
  subcription_id?: string;
  plan_id?: string;
  subscription_status?: string;
  current_period?: Date;
  trial_end?: Date;
  customer_id?: string;
  gdc_no?: string;
  qualification?: string;
  isVerified?: boolean;
  veriff_session_url?: string;
  session_id?: Date;
  session_created_at?: Date;
  created_at?: Date;
}