-- Portfolio metadata columns + alt_text backfill
-- Run in Supabase SQL Editor (same project as portfolio_items)

alter table portfolio_items
  add column if not exists width int,
  add column if not exists height int,
  add column if not exists poster_url text,
  add column if not exists alt_text text,
  add column if not exists city text;

-- Backfill missing alt_text from description; generic fallback when blank.
-- Do NOT invent city values for existing rows.
update portfolio_items
set alt_text = case
  when description is not null and length(trim(description)) > 0 then trim(description)
  else 'Stump grinding work in the Tampa Bay area'
end
where alt_text is null or length(trim(alt_text)) = 0;
