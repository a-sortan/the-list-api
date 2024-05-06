--drop procedure tls_load_get_all_lists;
create or replace procedure tls_load_get_all_lists(p_res inout jsonb default null) as $$
--call tls_load_get_all_lists();
begin
  select json_strip_nulls(json_agg(t)) as jsonb
  into p_res
  from (select id, pid, date_created, date_modified, title, tags, description, color
        from tls_list
        where deleted is false
      ) t;
    --  raise exception using message = concat('tls_load_get_all_lists: ', p_param_filter);
  EXCEPTION   
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_all_lists


--drop procedure tls_load_get_list_by_id;
create or replace procedure tls_load_get_list_by_id(p_list_id bigint, p_res inout jsonb default null) as $$
--call tls_load_get_list_by_id(901);
begin
  select row_to_json(t)
  into strict p_res
  from (select id, pid, title, description, tags, color 
        from tls_list 
        where id = p_list_id
          and deleted is false
       ) t;
    --  raise exception using message = concat('tls_load_get_all_lists: ', p_param_filter);
  exception
    when no_data_found then
      raise exception 'List with id % was not found', p_list_id;
    when too_many_rows then
      raise exception 'List with id % is not unique', p_list_id;
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_all_lists

--drop function tls_load_get_list_by_id
create or replace function tls_load_get_list_by_id(p_list_id bigint) returns json
as $$
begin
  return (select row_to_json(t)
                  from (select id, pid, title, description, tags, color 
                        from tls_list 
                        where id = p_list_id
                          and deleted is false) t
                );
end;
$$ language plpgsql; --tls_load_list_by_id


--drop procedure tls_load_get_all_tasks;
create or replace procedure tls_load_get_all_tasks(p_res inout jsonb default null) as $$
--call tls_load_get_all_tasks();
begin
  select json_strip_nulls(json_agg(t)) as jsonb
  into p_res
  from (select id, pid, date_created, date_modified, list_id, title, effort, tags, description, completed, date_completed, due_date
        from tls_task
        where deleted is false
      ) t;
    --  raise exception using message = concat('tls_load_get_all_tasks: ', p_param_filter);
  EXCEPTION   
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_all_tasks


--drop procedure tls_load_get_all_active_tasks;
create or replace procedure tls_load_get_all_active_tasks(p_res inout jsonb default null) as $$
--call tls_load_get_all_active_tasks();
begin
  select json_strip_nulls(json_agg(t)) as jsonb
  into p_res
  from (select id, pid, date_created, date_modified, list_id, title, effort, tags, description, completed, date_completed, due_date
        from tls_task
        where deleted is false
          and completed is false
      ) t;
    --  raise exception using message = concat('tls_load_get_all_active_tasks: ', p_param_filter);
  EXCEPTION   
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_all_active_tasks


--drop procedure tls_load_get_all_tasks_from_list;
create or replace procedure tls_load_get_all_tasks_from_list(p_list_id bigint, p_res inout jsonb default null) as $$
--call tls_load_get_all_tasks_from_list(901);
begin
  select json_strip_nulls(json_agg(t)) as jsonb
  into p_res
  from (select id, pid, date_created, date_modified, list_id, title, effort, tags, description, completed, date_completed, due_date
        from tls_task
        where list_id=p_list_id
          and deleted is false
      ) t;
    --  raise exception using message = concat('tls_load_get_all_tasks_from_list: ', p_param_filter);
  EXCEPTION   
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_all_tasks_from_list


--drop procedure tls_load_get_active_tasks_from_list;
create or replace procedure tls_load_get_active_tasks_from_list(p_list_id bigint, p_res inout jsonb default null) as $$
--call tls_load_get_active_tasks_from_list(901);
begin
  select json_strip_nulls(json_agg(t)) as jsonb
  into p_res
  from (select id, pid, date_created, date_modified, list_id, title, effort, tags, description, completed, date_completed, due_date
        from tls_task
        where list_id=p_list_id
          and deleted is false
          and completed is false
      ) t;
    --  raise exception using message = concat('tls_load_get_active_tasks_from_list: ', p_param_filter);
  EXCEPTION   
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_active_tasks_from_list


--drop procedure tls_load_get_task_by_id;
create or replace procedure tls_load_get_task_by_id(p_task_id bigint, p_res inout jsonb default null) as $$
--call tls_load_get_task_by_id(2311);
begin
  select row_to_json(t)
  into strict p_res
  from (select id, pid, date_created, date_modified, list_id, title, effort, 
               tags, description, completed, date_completed, due_date 
        from tls_task
        where id = p_task_id
          and deleted is false
       ) t;
    --  raise exception using message = concat('tls_load_get_task_by_id: ', p_param_filter);
  exception
    when no_data_found then
      raise exception 'Task with id % was not found', p_task_id;
    when too_many_rows then
      raise exception 'Task with id % is not unique', p_task_id;
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_task_by_id


--drop procedure tls_load_get_all_rewards;
create or replace procedure tls_load_get_all_rewards(p_res inout jsonb default null) as $$
--call tls_load_get_all_rewards();
begin
  select json_strip_nulls(json_agg(t)) as jsonb
  into p_res
  from (select id, date_created, date_modified, title, description, effort_lvl, active, list_id
        from tls_reward
        where deleted is false
      ) t;
    --  raise exception using message = concat('tls_load_get_all_rewards: ', p_param_filter);
  EXCEPTION   
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_all_rewards


--drop procedure tls_load_get_reward_by_id;
create or replace procedure tls_load_get_reward_by_id(p_reward_id bigint, p_res inout jsonb default null) as $$
--call tls_load_get_reward_by_id(2711);
begin
  select row_to_json(t)
  into strict p_res
  from (select id, date_created, date_modified, title, description, effort_lvl, active, list_id 
        from tls_reward
        where id = p_reward_id
          and deleted is false
       ) t;
    --  raise exception using message = concat('tls_load_get_reward_by_id: ', p_param_filter);
  exception
    when no_data_found then
      raise exception 'Reward with id % was not found', p_reward_id;
    when too_many_rows then
      raise exception 'Reward with id % is not unique', p_reward_id;
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_task_by_id


--drop procedure tls_load_get_task_info_for_todoist;
create or replace procedure tls_load_get_task_info_for_todoist(p_task_id bigint, p_res inout jsonb default null) as $$
--call tls_load_get_task_info_for_todoist(2311);
declare
  l_res     jsonb;
begin
  select jsonb_build_object('task',t)
  into strict p_res
  from (select id, pid, date_created, date_modified, list_id, title, effort, 
               tags, description, completed, date_completed, due_date 
        from tls_task
        where id = p_task_id
          and deleted is false
       ) t;
--  p_res := coalesce(l_res, '{}');
  select jsonb_build_object('task_todoist',t)
  into l_res
  from (select task_id, todoist_id, date_created, date_modified, deleted
        from tls_todoist_task
        where task_id=p_task_id
       ) t;
  p_res := p_res || coalesce(l_res, '{}');
--      raise exception using message = concat('tls_load_get_task_info_for_todoist: ', p_res);
  exception
    when no_data_found then
      raise exception 'Task with id % was not found', p_task_id;
    when too_many_rows then
      raise exception 'Task with id % is not unique', p_task_id;
    when others then 
      raise;
end;
$$ language plpgsql;--tls_load_get_task_by_id

