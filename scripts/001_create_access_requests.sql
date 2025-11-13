-- Create access_requests table
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  github_token TEXT,
  docker_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert access requests"
  ON public.access_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view all access requests"
  ON public.access_requests FOR SELECT
  USING (true);

CREATE POLICY "Admins can update access requests"
  ON public.access_requests FOR UPDATE
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_access_requests_github ON public.access_requests(github_username);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON public.access_requests(status);
