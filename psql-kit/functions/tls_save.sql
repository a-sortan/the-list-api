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
                                                          pid bigint, title varchar(30), tags varchar(200),
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
--call tls_save_delete_list(901);
begin
  p_res:=false;
--  raise exception using message = concat('tls_save_delete_list: ', p_col_val);
  update tls_list
  set(date_modified, deleted) = (localtimestamp, true)
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


insert into tls_task(id, pid, title) 
  select 2306 id, 901 list_id, title 
  from json_populate_record(null::record, '{"title":"some task"}') 
          as (pid bigint, title varchar(30), effort smallint, tags varchar(200), description varchar(1000))


--drop procedure tls_save_add_task;
create or replace procedure tls_save_add_task(p_list_id bigint, p_col_names varchar, p_col_val jsonb, p_res inout jsonb default null) as $$
--call tls_save_add_task(901, 'title', '{"title":"some task"}')
declare
  l_task_id     bigint;
  l_rec         record;
  l_sql         text;
begin
  l_task_id:=nextval('tls_sequence');
  l_sql:='
insert into tls_task(id, list_id, %s) 
  select $1 id, $2 list_id, %s 
  from jsonb_populate_record(null::record, $3) 
          as (pid bigint, title varchar(30), effort smallint, tags varchar(200), description varchar(1000))
returning *';
  l_sql:=format(l_sql, p_col_names, p_col_names, p_col_names);
--  raise exception using message = concat('tls_save_add_task: ', l_sql);
  execute l_sql using l_task_id, p_list_id, p_col_val into strict l_rec;
  select row_to_json(l_rec) into p_res;
exception
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_add_task


--drop procedure tls_save_update_task;
create or replace procedure tls_save_update_task(p_task_id bigint, p_col_names varchar, p_col_val jsonb, p_res inout jsonb default null) as $$
--call tls_save_update_task(2311, 'title,description,effort', '{"title":"updated task", "description":"updated description","effort":4}'::jsonb)
declare
  l_sql             text;
  l_rec             record;
begin
  l_sql:='
update tls_task
set (date_modified, %s) = (select localtimestamp date_modified, %s
                           from jsonb_populate_record(null::record, $1)
                                  as (
                                      pid bigint, list_id bigint, title varchar(30), effort smallint, tags varchar(200), description varchar(1000),
                                      completed boolean, date_completed timestamp, due_date timestamp
                                     )
                          )
where id = $2
  and deleted is false
returning *';
  l_sql:=format(l_sql, p_col_names, p_col_names);
--  raise exception using message = concat('tls_save_update_list: ', l_sql);
  execute l_sql using p_col_val, p_task_id into strict l_rec;
  select row_to_json(l_rec) into p_res;
exception
  when no_data_found then
    raise exception 'Task with id % was not found! It was probably deleted before', p_task_id;
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_update_list   


--drop procedure tls_save_delete_task;
create or replace procedure tls_save_delete_task(p_task_id bigint, p_res inout boolean default false) as $$
--call tls_save_delete_task(2311);
begin
  p_res:=false;
--  raise exception using message = concat('tls_save_delete_task: ', p_col_val);
  update tls_task
  set(date_modified, deleted) = (localtimestamp, true)
  where id = p_task_id
    and deleted is false
  returning true into strict p_res;
exception
  when no_data_found then
    raise exception 'Task with id % was not found! It was probably deleted before', p_task_id;
  when others then 
    raise;
end;
$$ language plpgsql;--tls_save_delete_task