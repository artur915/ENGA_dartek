-- Persist milestone completion percentage for cross-portal schedule sync
ALTER TABLE public.milestones
  ADD COLUMN IF NOT EXISTS progress_percent INT NOT NULL DEFAULT 0
  CHECK (progress_percent >= 0 AND progress_percent <= 100);

UPDATE public.milestones
SET progress_percent = 100
WHERE status = 'green';
