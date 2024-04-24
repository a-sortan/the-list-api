--drop procedure tls_load_get_all_lists;
create or replace procedure tls_load_get_all_lists (p_res inout jsonb) as $$
--call tls_load_get_all_lists( null);
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
create or replace procedure tls_load_get_list_by_id (p_list_id bigint, p_res inout jsonb) as $$
--call tls_load_get_list_by_id(901, null);
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


--select tls_load_list_by_id(901);
