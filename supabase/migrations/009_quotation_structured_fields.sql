-- Extended quotation fields: structured deliverables, payments, terms, estimated duration

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quotations' AND column_name = 'estimated_duration'
  ) THEN
    ALTER TABLE public.quotations ADD COLUMN estimated_duration TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quotations' AND column_name = 'payment_terms_type'
  ) THEN
    ALTER TABLE public.quotations
      ADD COLUMN payment_terms_type TEXT NOT NULL DEFAULT 'full_on_completion';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quotations' AND column_name = 'payment_milestones'
  ) THEN
    ALTER TABLE public.quotations ADD COLUMN payment_milestones JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quotations' AND column_name = 'deliverables_items'
  ) THEN
    ALTER TABLE public.quotations ADD COLUMN deliverables_items JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quotations' AND column_name = 'terms_and_conditions'
  ) THEN
    ALTER TABLE public.quotations ADD COLUMN terms_and_conditions JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;

UPDATE public.quotations
SET estimated_duration = timeline_days::text || ' days'
WHERE estimated_duration IS NULL AND timeline_days IS NOT NULL;

ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS quotations_payment_terms_type_check;
ALTER TABLE public.quotations
  ADD CONSTRAINT quotations_payment_terms_type_check
  CHECK (payment_terms_type IN ('full_on_completion', 'advance_balance', 'milestones'));

NOTIFY pgrst, 'reload schema';
