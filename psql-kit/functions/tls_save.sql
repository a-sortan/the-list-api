--drop procedure tls_save_add_list;
create or replace procedure tls_save_add_list(p_col_val jsonb, r_tls_list_id inout bigint default null) as $$
--call tls_save_add_list('{"title":"the list", "color":"grey"}', null)
begin
  r_tls_list_id:=nextval('tls_sequence');
  insert into tls_list(id, pid, title, tags, description, color)
  select r_tls_list_id id, pid, title, tags, description, color
  from jsonb_populate_record(null::record, p_col_val) as (
                                                          pid smallint, title varchar(30), tags varchar(200),
                                                          description varchar(200), color varchar(100)
                                                          );
  --raise exception using message = concat('tls_save_add_list: ', p_col_val);
exception
  when unique_violation then
    raise exception using message = 'A list with the same title or id was already saved';
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_add_list
 

--drop procedure tls_save_update_list;
create or replace procedure tls_save_update_list(p_list_id smallint, p_col_names varchar, p_col_val jsonb, r_res inout jsonb default null) as $$
--call tls_save_update_list(901::smallint, 'title', '{"title":"the new list"}'::jsonb, null)
declare
  l_sql             text;
  l_date_modified   timestamp;
  l_res             jsonb;
  l_str             text;
begin
  l_date_modified:=localtimestamp;
  l_sql:='
update tls_list
set(date_modified, '||p_col_names||') = (select '''||l_date_modified||'''::timestamp date_modified,'||p_col_names
                                        ||' from jsonb_populate_record(null::record, ''' || p_col_val
                                        ||''') as (title varchar(30), tags varchar(200), description varchar(200), color varchar(30)) 
                                        )
where id='||p_list_id
||'and deleted is false';
--raise exception using message = concat('tls_save_update_list: ', l_sql);
execute l_sql using p_col_val;
if not found then
  raise exception 'List with id % was not found! It was probably deleted before', p_list_id;
end if;
l_str:='{"id":'||p_list_id||', "date_modified":"'||l_date_modified||'"}';
r_res:=l_str::jsonb;
exception
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_update_list   


--drop procedure tls_save_delete_list;
create or replace procedure tls_save_delete_list(p_list_id smallint, r_tls_status inout boolean default false) as $$
--call tls_save_delete_list(1106::smallint);
begin
--  raise exception using message = concat('tls_save_delete_list_name: ', p_col_val);
  update tls_list
  set(date_modified, deleted) = (select localtimestamp date_modified, true deleted)
  where id = p_list_id
    and deleted is false
  returning true into strict r_tls_status;
exception
  when no_data_found then
    raise exception 'List with id % was not found! It was probably deleted before', p_list_id;
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_delete_list   
