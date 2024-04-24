--drop table tls_list;
create table tls_list (
  id              bigint          not null,
  pid             bigint,                      --parent list id; tls_list(id)
  date_created    timestamp       default localtimestamp,
  date_modified   timestamp,
  deleted         boolean         default false,
  title           varchar(30)     not null,
  tags            varchar(200),
  description     varchar(200),
  color           varchar(100)    --format: #rrggbb/red
);

create unique index tls_list_pk on tls_list(id);
create unique index tls_list_title_udx on tls_list(lower(title));

alter table tls_list
add primary key
using index tls_list_pk;

alter table tls_list
add constraint  tls_list_pid_fk 
foreign key(pid)
references tls_list(id);