/*
  # Create cybersecurity platform schema

  1. New Tables
    - `threat_detections`
      - `id` (uuid, primary key)
      - `type` (text, constrained to specific threat types)
      - `severity` (text, constrained to severity levels)
      - `description` (text)
      - `source` (text)
      - `detected_at` (timestamp with timezone)
      - `status` (text, constrained to status values)
      - `metadata` (jsonb for additional data)

    - `scan_results`
      - `id` (uuid, primary key)
      - `scan_type` (text)
      - `result` (jsonb)
      - `confidence_score` (numeric between 0 and 1)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (for demo purposes)

  3. Indexes
    - Performance indexes on commonly queried columns
*/

-- Create threat_detections table
CREATE TABLE IF NOT EXISTS threat_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('phishing', 'fraud', 'intrusion', 'deepfake')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  source text NOT NULL,
  detected_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'investigating')),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create scan_results table
CREATE TABLE IF NOT EXISTS scan_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_type text NOT NULL,
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE threat_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Public access to threat_detections"
  ON threat_detections
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access to scan_results"
  ON scan_results
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threat_detections_detected_at ON threat_detections (detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_detections_type ON threat_detections (type);
CREATE INDEX IF NOT EXISTS idx_threat_detections_severity ON threat_detections (severity);

CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_results_scan_type ON scan_results (scan_type);

-- Insert some sample data for demonstration
INSERT INTO threat_detections (type, severity, description, source, metadata) VALUES
  ('phishing', 'high', 'Suspicious email with malicious links detected', 'Email Scanner', '{"domain": "suspicious-site.com", "links": 3}'),
  ('fraud', 'critical', 'Unusual transaction pattern detected', 'Transaction Monitor', '{"amount": 50000, "location": "unknown"}'),
  ('intrusion', 'medium', 'Multiple failed login attempts from unknown IP', 'Network Monitor', '{"ip": "192.168.1.100", "attempts": 15}'),
  ('deepfake', 'high', 'Manipulated media content detected', 'Media Analyzer', '{"confidence": 0.89, "type": "video"}'),
  ('phishing', 'medium', 'Potential scam website reported', 'Web Crawler', '{"url": "fake-bank.net", "similarity": 0.95}');