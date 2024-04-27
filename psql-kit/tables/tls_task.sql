--drop table tls_task;
create table tls_task (
  id                  bigint          not null,
  pid                 bigint,                                            --parent task id; tls_list_task(id)
  date_created        timestamp(0)                     default localtimestamp(0),
  date_modified       timestamp(0),
  deleted             boolean                       default false,
  list_id             bigint          not null,                         --tls_list(id)
  title               varchar(30)     not null,
  effort              smallint        not null      default 1,          --effort score 1-5
  tags                varchar(200),
  description         varchar(1000),
  completed           boolean                       default false,
  date_completed      timestamp(0),
  due_date            timestamp(0)
--  is_recurring        boolean,
--  recurrence_mode     varchar(10),                --repeat/do every/fixed
--                                                  --repeat every x days/weeks/months/years | 
--                                                  --do x times a day/week/month/year |
--                                                  --fixed schedule days of week
--  recurrence_interval smallint,                   --for repeat/do
--  recurrence_unit     varchar(50),                --for repeat/do; days/weeks/months/years
--  recurrence_schedule varchar(50),                --for fixed; a list of days mon,tue,fri,sun 
--  active_seasons      smallint                    --1-12; number of month when the task should be active
);

create unique index tls_task_pk on tls_task(id);
--create unique index tls_task_title_udx on tls_task(lower(title));


alter table tls_task
add primary key
using index tls_task_pk;

alter table tls_task
add constraint  tls_task_list_id_fk 
foreign key(list_id)
references tls_list(id);

alter table tls_task
add constraint tls_task_pid_fk
foreign key(pid)
references tls_task(id);

alter table tls_task
add constraint tls_list_effort_interval
check(effort >= 1 and effort <= 5);

