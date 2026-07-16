export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: string;
          locale: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      agencies: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          name_ar: string | null;
          commercial_registration: string | null;
          engineering_license: string | null;
          description: string | null;
          description_ar: string | null;
          disciplines: string[];
          service_areas: string[];
          indicative_price_from: number | null;
          status: string;
          approved_at: string | null;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["agencies"]["Row"]> & {
          owner_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["agencies"]["Row"]>;
      };
      project_requests: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string | null;
          location_city: string | null;
          location_district: string | null;
          location_lat: number | null;
          location_lng: number | null;
          package_id: number | null;
          status: string;
          floated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["project_requests"]["Row"]> & {
          client_id: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["project_requests"]["Row"]>;
      };
      quotations: {
        Row: {
          id: string;
          request_id: string;
          agency_id: string;
          price: number;
          scope: string | null;
          deliverables: string | null;
          timeline_days: number | null;
          payment_terms: string | null;
          status: string;
          revision_number: number;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["quotations"]["Row"]> & {
          request_id: string;
          agency_id: string;
          price: number;
        };
        Update: Partial<Database["public"]["Tables"]["quotations"]["Row"]>;
      };
      request_invitations: {
        Row: {
          id: string;
          request_id: string;
          agency_id: string;
          invited_at: string;
          viewed_at: string | null;
        };
      };
      service_packages: {
        Row: {
          id: number;
          slug: string;
          name: string;
          description: string | null;
        };
      };
      engineering_services: {
        Row: {
          id: number;
          name: string;
          category_id: number;
          provider: string;
          provider_type: string;
        };
      };
      agreements: {
        Row: {
          id: string;
          quotation_id: string;
          request_id: string;
          agency_id: string;
          client_id: string;
          signed_at: string | null;
        };
      };
    };
  };
}
