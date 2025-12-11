// Core entities

export interface Family {
  id: string;
  created_at: string;
  name: string; // "The Johnson Family"
  neighborhood: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    zip: string;
  };
  bio: string;
  photo_url: string;
  children: Child[];
  interests: string[];
  verified: boolean;
  privacy_radius: number; // blur exact location by X meters
}

export interface Child {
  id: string;
  family_id: string;
  name: string; // first name only
  age_years: number;
  age_months?: number;
  interests: string[];
  school_age_group:
    | "infant"
    | "toddler"
    | "preschool"
    | "elementary"
    | "middle"
    | "high";
}

export interface Connection {
  id: string;
  requester_family_id: string;
  receiver_family_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  message?: string;
}

export interface Conversation {
  id: string;
  family_ids: string[]; // exactly 2
  created_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_family_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Event {
  id: string;
  host_family_id: string;
  title: string;
  description: string;
  location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
  datetime: string;
  age_range_min?: number;
  age_range_max?: number;
  max_families?: number;
  attendees: string[]; // family_ids
  visibility: "connections_only" | "neighborhood" | "public";
}

