--drop table tls_todoist_task;
create table tls_todoist_task (
  task_id                 bigint        not null,
  todoist_id              bigint        not null,
  date_created            timestamp(0)  not_null      default localtimestamp,
  date_modified           timestamp(0),
  deleted                 boolean                     default false
);

create unique index tls_todoist_task_pk on tls_todoist_task(task_id);
--create unique index tls_task_title_udx on tls_task(lower(title));


alter table tls_todoist_task
add primary key
using index tls_todoist_task_pk;

alter table tls_todoist_task
add constraint  tls_todoist_task_id_fk 
foreign key(task_id)
references tls_task(id);
