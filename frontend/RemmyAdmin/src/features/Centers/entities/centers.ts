export interface CenterType {
  id: number
  name: string
}

export interface Address {
  id: number
  road_name: string | null
  road_num: number | null
  postal_code: number | null
  formatted_address: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  mapbox_place_id: string | null
  id_local_zone: number | null
}

export interface Phone {
  id: number
  phone: string
  id_center: number
}

export interface Center {
  id: number
  name: string
  description: string | null
  id_type: number | null
  center_type?: CenterType | null
  email: string | null
  website: string | null
  address?: Address | null
  phones?: Phone[]
  created_at: string
  updated_at: string
}

export type CreateCenterPayload = {
  name: string
  description?: string | null
  id_type?: number | null
  email?: string | null
  website?: string | null
}

export type UpdateCenterPayload = Partial<CreateCenterPayload>

export type CreateAddressPayload = {
  id: number
  road_name?: string | null
  road_num?: number | null
  postal_code?: number | null
  formatted_address?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  mapbox_place_id?: string | null
  id_local_zone?: number | null
}
