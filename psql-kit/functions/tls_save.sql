--drop procedure tls_save_add_list;
create or replace procedure tls_save_add_list(p_col_val jsonb, p_res inout jsonb default null) as $$
--call tls_save_add_list('{"title":"some random list", "color":"orange"}')
declare
  l_list_id     bigint;
  l_rec         record;
begin
  l_list_id:=nextval('tls_sequence');
  insert into tls_list(id, pid, title, tags, description, color)
  select l_list_id id, pid, title, tags, description, color
  from jsonb_populate_record(null::record, p_col_val) as (
                                                          pid smallint, title varchar(30), tags varchar(200),
                                                          description varchar(200), color varchar(100)
                                                          )
  returning * into l_rec;
  select row_to_json(l_rec) into p_res;
  --raise exception using message = concat('tls_save_add_list: ', p_col_val);
exception
  when unique_violation then
    raise exception using message = 'A list with the same title or id was already created';
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_add_list
 

--drop procedure tls_save_update_list;
create or replace procedure tls_save_update_list(p_list_id bigint, p_col_names varchar, p_col_val jsonb, p_res inout jsonb default null) as $$
--call tls_save_update_list(901, 'title, color', '{"title":"the list", "color":"blue"}'::jsonb)
declare
  l_sql             text;
  l_date_modified   timestamp;
  l_res             jsonb;
  l_str             text;
  l_rec             record;
begin
  l_sql:='
update tls_list 
set (date_modified, %s) = (select localtimestamp date_modified, %s
                           from jsonb_populate_record(null::record, $1)
                                  as (title varchar(30), tags varchar(200), description varchar(200), color varchar(30))
                          )
where id = $2
  and deleted is false
returning *';
  l_sql:=format(l_sql, p_col_names, p_col_names);
--  raise exception using message = concat('tls_save_update_list: ', l_sql);
  execute l_sql using p_col_val, p_list_id into strict l_rec;
  select row_to_json(l_rec) into p_res;
exception
  when no_data_found then
    raise exception 'List with id % was not found! It was probably deleted before', p_list_id;
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_update_list   


--drop procedure tls_save_delete_list;
create or replace procedure tls_save_delete_list(p_list_id bigint, p_res inout boolean default false) as $$
--call tls_save_delete_list(901::smallint);
begin
  p_res:=false;
--  raise exception using message = concat('tls_save_delete_list_name: ', p_col_val);
  update tls_list
  set(date_modified, deleted) = (select localtimestamp date_modified, true deleted)
  where id = p_list_id
    and deleted is false
  returning true into strict p_res;
exception
  when no_data_found then
    raise exception 'List with id % was not found! It was probably deleted before', p_list_id;
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_delete_list

