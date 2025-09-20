import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      threat_detections: {
        Row: {
          id: string;
          type: 'phishing' | 'fraud' | 'intrusion' | 'deepfake';
          severity: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          source: string;
          detected_at: string;
          status: 'active' | 'resolved' | 'investigating';
          metadata: any;
        };
        Insert: {
          type: 'phishing' | 'fraud' | 'intrusion' | 'deepfake';
          severity: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          source: string;
          metadata?: any;
        };
      };
      scan_results: {
        Row: {
          id: string;
          scan_type: string;
          result: any;
          confidence_score: number;
          created_at: string;
        };
        Insert: {
          scan_type: string;
          result: any;
          confidence_score: number;
        };
      };
    };
  };
};