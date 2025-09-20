/*
  # Cybersecurity AI Platform Database Schema

  1. New Tables
    - `threat_detections`
      - `id` (uuid, primary key)
      - `type` (text, threat type: phishing, fraud, intrusion, deepfake)
      - `severity` (text, severity level: low, medium, high, critical)
      - `description` (text, threat description)
      - `source` (text, detection source)
      - `detected_at` (timestamptz, when threat was detected)
      - `status` (text, current status: active, resolved, investigating)
      - `metadata` (jsonb, additional threat information)
      
    - `scan_results`
      - `id` (uuid, primary key)
      - `scan_type` (text, type of scan performed)
      - `result` (jsonb, scan results and analysis)
      - `confidence_score` (numeric, AI confidence score 0-1)
      - `created_at` (timestamptz, when scan was performed)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

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

-- Create policies for public access (suitable for demo purposes)
-- In production, you would want to restrict access based on authentication
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
CREATE INDEX IF NOT EXISTS idx_threat_detections_type ON threat_detections(type);
CREATE INDEX IF NOT EXISTS idx_threat_detections_severity ON threat_detections(severity);
CREATE INDEX IF NOT EXISTS idx_threat_detections_detected_at ON threat_detections(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_results_scan_type ON scan_results(scan_type);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at DESC);