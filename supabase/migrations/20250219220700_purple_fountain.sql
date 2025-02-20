/*
  # Create reports table

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `service_slug` (text, reference to services)
      - `ip_address` (text, for rate limiting)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `reports` table
    - Add policy for authenticated users to read reports count
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL,
  ip_address text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_reports_service_slug ON reports(service_slug);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_ip_service ON reports(ip_address, service_slug);

-- Habilita RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura pública de contagem de relatos"
  ON reports
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir inserção de relatos"
  ON reports
  FOR INSERT
  TO public
  WITH CHECK (true);