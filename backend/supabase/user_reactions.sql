create table if not exists
  user_reactions (
    user_id text not null,
    reaction_id text not null,
    type text not null,
    content_type text not null,
    created_time timestamp not null default now(),
    -- deprecated
    data jsonb not null,
    fs_updated_time timestamp not null,
    primary key (user_id, reaction_id)
  );

alter table user_reactions enable row level security;

drop policy if exists "public read" on user_reactions;

create policy "public read" on user_reactions for
select
  using (true);

-- useful for getting all reactions for a given contentId recently
create index if not exists user_reactions_content_id on user_reactions (content_id created_time desc);

alter table user_reactions
cluster on user_reactions_type;
