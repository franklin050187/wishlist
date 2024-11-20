-- Function to drop the gifts table if it exists
create or replace function drop_gifts_table_if_exists()
returns void as $$
begin
    drop table if exists gifts;
end;
$$ language plpgsql security definer;

-- Function to create the gifts table
create or replace function create_gifts_table(schema_definition text)
returns void as $$
begin
    execute 'create table gifts (' || schema_definition || ')';
end;
$$ language plpgsql security definer;

-- Function to create triggers
create or replace function create_gifts_triggers()
returns void as $$
begin
    -- Create updated_at trigger function if it doesn't exist
    create or replace function update_updated_at_column()
    returns trigger as $$
    begin
        new.updated_at = now();
        return new;
    end;
    $$ language plpgsql;

    -- Create the trigger
    drop trigger if exists set_updated_at on gifts;
    create trigger set_updated_at
        before update on gifts
        for each row
        execute function update_updated_at_column();
end;
$$ language plpgsql security definer;

-- Function to verify table structure
create or replace function verify_gifts_table_structure(expected_schema text)
returns boolean as $$
declare
    current_schema text;
begin
    -- Get current table schema (simplified comparison)
    select string_agg(
        column_name || ' ' || 
        data_type || 
        case when character_maximum_length is not null 
             then '(' || character_maximum_length || ')' 
             else '' 
        end,
        ', '
    )
    into current_schema
    from information_schema.columns
    where table_name = 'gifts'
    and table_schema = 'public';

    -- Compare schemas (basic comparison, might need enhancement based on your needs)
    return position(current_schema in expected_schema) > 0;
end;
$$ language plpgsql security definer; 