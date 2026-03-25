export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      CENTERS: {
        Row: {
          id: number
          name: string
          description: string | null
          id_type: number | null
          email: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          id_type?: number | null
          email?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          id_type?: number | null
          email?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      CENTER_TYPES: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      ADDRESSES: {
        Row: {
          id: number
          road_name: string | null
          road_num: number | null
          road_type: number | null
          postal_code: number | null
          formatted_address: string | null
          geo_location: unknown | null
          id_local_zone: number | null
          city: string | null
          latitude: number | null
          longitude: number | null
          mapbox_place_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: number
          road_name?: string | null
          road_num?: number | null
          road_type?: number | null
          postal_code?: number | null
          formatted_address?: string | null
          geo_location?: unknown | null
          id_local_zone?: number | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          mapbox_place_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          road_name?: string | null
          road_num?: number | null
          road_type?: number | null
          postal_code?: number | null
          formatted_address?: string | null
          geo_location?: unknown | null
          id_local_zone?: number | null
          city?: string | null
          latitude?: number | null
          longitude?: number | null
          mapbox_place_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      PHONES: {
        Row: {
          id: number
          phone: string
          id_center: number
        }
        Insert: {
          id?: number
          phone: string
          id_center: number
        }
        Update: {
          id?: number
          phone?: string
          id_center?: number
        }
      }
      SOCIAL_MEDIA: {
        Row: {
          id: number
          name: string
          url_img: string
        }
        Insert: {
          id?: number
          name: string
          url_img: string
        }
        Update: {
          id?: number
          name?: string
          url_img?: string
        }
      }
      CENTER_SOCIALMEDIA: {
        Row: {
          id_center: number
          id_socialmedia: number
          link: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id_center: number
          id_socialmedia: number
          link: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id_center?: number
          id_socialmedia?: number
          link?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      COMMUNITIES: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
      }
      PROVINCES: {
        Row: {
          id: number
          name: string
          id_community: number
        }
        Insert: {
          id?: number
          name: string
          id_community: number
        }
        Update: {
          id?: number
          name?: string
          id_community?: number
        }
      }
      CITIES: {
        Row: {
          id: number
          name: string
          id_province: number
        }
        Insert: {
          id?: number
          name: string
          id_province: number
        }
        Update: {
          id?: number
          name?: string
          id_province?: number
        }
      }
      LOCAL_ZONES: {
        Row: {
          id: number
          name: string
          id_city: number
        }
        Insert: {
          id?: number
          name: string
          id_city: number
        }
        Update: {
          id?: number
          name?: string
          id_city?: number
        }
      }
      ROAD_TYPES: {
        Row: {
          id: number
          code: string | null
          name: string | null
        }
        Insert: {
          id?: number
          code?: string | null
          name?: string | null
        }
        Update: {
          id?: number
          code?: string | null
          name?: string | null
        }
      }
      CHARACTERISTIC_TYPES: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      CENTER_CHARACTERISTICS: {
        Row: {
          id: number
          id_center: number | null
          id_characteristic: number | null
        }
        Insert: {
          id?: number
          id_center?: number | null
          id_characteristic?: number | null
        }
        Update: {
          id?: number
          id_center?: number | null
          id_characteristic?: number | null
        }
      }
    }
    Views: {
      postal_code_lookup: {
        Row: {
          postal_code: string
          city_id: number
          city: string
          province_id: number
          province: string
          community_id: number
          community: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Views<T extends keyof Database['public']['Views']> =
  Database['public']['Views'][T]['Row']
