--drop table tls_reward;
create table tls_reward (
  id                  bigint            not null,
  date_created        timestamp(0)                  default localtimestamp,
  date_modified       timestamp(0),
  deleted             boolean                       default false,
  title               varchar(100)       not null,
  description         varchar(200),
  effort_lvl          smallint          not null    default 1,        -- used as reward for effort score 1-5 in tls_task
                                                                      -- for a task with effort 4 get a reward with effort_lvl <= 4; 
  active              boolean           not null    default true,
  list_id             bigint                                          -- list specific rewards
);

create unique index tls_reward_pk on tls_reward(id);
create unique index tls_reward_title_udx on tls_reward(lower(title));


alter table tls_reward
add primary key
using index tls_reward_pk;

alter table tls_reward
add constraint tls_reward_effort_lvl_interval
check(effort_lvl >= 1 and effort_lvl <= 5);

alter table tls_reward
add constraint tls_reward_list_id_fk
foreign key(list_id)
references tls_list(id);



