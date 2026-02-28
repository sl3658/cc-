create extension if not exists pgcrypto;

create table if not exists coffee_chats (
  id uuid primary key default gen_random_uuid(),
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  duration_minutes int not null check (duration_minutes in (15,30)),
  name text not null,
  email text not null,
  linkedin_url text not null,
  organization text not null,
  discussion_topic text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  google_event_id text,
  meet_link text,
  created_at timestamptz not null default now(),
  unique(slot_start, slot_end)
);

create table if not exists availability_overrides (
  id bigint generated always as identity primary key,
  start_time timestamptz not null,
  end_time timestamptz not null,
  is_available boolean not null,
  updated_by text not null,
  created_at timestamptz not null default now(),
  unique(start_time, end_time)
);

create or replace function book_chat_slot(
  p_start_time timestamptz,
  p_end_time timestamptz,
  p_name text,
  p_email text,
  p_linkedin_url text,
  p_organization text,
  p_discussion_topic text,
  p_duration_minutes int
)
returns setof coffee_chats
language plpgsql
as $$
declare
  inserted coffee_chats;
begin
  perform pg_advisory_xact_lock(hashtext(p_start_time::text || p_end_time::text));

  if exists (
    select 1
    from coffee_chats
    where status != 'cancelled'
      and tstzrange(slot_start, slot_end, '[)') && tstzrange(p_start_time, p_end_time, '[)')
  ) then
    raise exception 'Time slot already booked';
  end if;

  insert into coffee_chats (
    slot_start,
    slot_end,
    duration_minutes,
    name,
    email,
    linkedin_url,
    organization,
    discussion_topic,
    status
  ) values (
    p_start_time,
    p_end_time,
    p_duration_minutes,
    p_name,
    p_email,
    p_linkedin_url,
    p_organization,
    p_discussion_topic,
    'pending'
  )
  returning * into inserted;

  return next inserted;
end;
$$;
