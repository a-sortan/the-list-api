--the_list_admin user owns all objects for the-list-api's database. 
--Every schema, table, index etc is owned by this user. 
--the_list_admin is the only user used for schema changes.
create role the_list_admin
login createrole
password 'password' --remember to change password
connection limit -1;

alter role the_list_admin set statement_timeout=20000; --20 sec
alter role the_list_admin set lock_timeout=3000;
alter role the_list_admin set idle_in_transaction_session_timeout=3000;

--Create the api_readwrite_users Role. The api_readwrite_users role groups users that require 
--read and write access (CRUD) to objects owned by api_admin.
create role the_list_rw_users nologin; --read/write
create role the_list_r_users nologin; --read
commit;

--Create the Database.
--Postgres enables connection privileges to new databases for all users (PUBLIC) by default. 
--Postgres also creates the public schema enabling usage and creation of tables within that schema for all users. 
--Instead of relying on implicit privileges from the default installation, 
--we want to declare privileges to roles explicitly. This puts us in a state of least privilege first, 
--and then we add new privileges afterward. 
CREATE DATABASE the_list 
WITH OWNER the_list_admin 
ENCODING UTF8 
LC_COLLATE 'en_US.UTF-8' 
LC_CTYPE 'en_US.UTF-8'
template template0;

-- connect to new database with superuser
--revoke all privileges for the database and drop the public schema.
REVOKE ALL ON DATABASE the_list FROM PUBLIC;
DROP SCHEMA public;

--Now create the schema. The schema is named after the database to keep things simple.
--SET ROLE the_list_admin;
--CREATE SCHEMA the_list;
--RESET ROLE;