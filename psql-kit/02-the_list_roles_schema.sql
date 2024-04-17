-- connect to new database with the_list_admin
CREATE SCHEMA the_list;

--Now we default the owner user to the_list schema on connection since we dropped the public schema. 
--Also, if this was not set, then owner defaults to "$user" -- i.e., the owner schema that does not exist.
ALTER ROLE the_list_admin SET search_path TO the_list; --schema the_list

--We also need to set our session's search_path to the_list so that we, as a superuser, 
--properly create objects in the the_list schema.
SET search_path TO the_list; 
--GRANTs for Resources
--With the basic resources provisioned, we grant privileges for the the_list_admin user, 
--the_list_rw_users role, and the_list_r_users role. Starting with the the_list database.

GRANT CONNECT ON DATABASE the_list TO the_list_rw_users;
GRANT TEMPORARY ON DATABASE the_list TO the_list_rw_users;

GRANT CONNECT ON DATABASE the_list TO the_list_r_users;
GRANT TEMPORARY ON DATABASE the_list TO the_list_r_users;

--grant privileges to the the_list schema.
GRANT USAGE ON SCHEMA the_list TO the_list_rw_users;
GRANT USAGE ON SCHEMA the_list TO the_list_r_users;

-- Not needed, but being explicit helps with /dn+
GRANT CREATE, USAGE ON SCHEMA the_list TO the_list_admin;
--Future-proofing
--GRANT (and REVOKE) enables privileges for existing objects but not for new objects. 
--This is accomplished with ALTER DEFAULT PRIVILEGES.

--Let's configure privileges for the the_list_rw_users role. 
--We want to ensure new objects like tables or indexes allow, well, read and write privileges for the users 
--in the the_list_rw_users role. SELECT, INSERT, UPDATE, but no DELETE.

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT SELECT, INSERT, UPDATE
  ON TABLES
  TO the_list_rw_users;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT USAGE, SELECT, UPDATE
  ON SEQUENCES
  TO the_list_rw_users;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT EXECUTE
  ON FUNCTIONS
  TO the_list_rw_users;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT USAGE
  ON TYPES
  TO the_list_rw_users;
--these statements rely on the_list_admin to create all objects in the database. 
--these statements do not include privileges that would allow a user in the_list_rw_users to create objects. 

--the_list_r_users role.
ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT SELECT
  ON TABLES
  TO the_list_r_users;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT USAGE, SELECT
  ON SEQUENCES
  TO the_list_r_users;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT EXECUTE
  ON FUNCTIONS
  TO the_list_r_users;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  IN SCHEMA the_list
  GRANT USAGE
  ON TYPES
  TO the_list_r_users;
--Finally, we want to ensure PUBLIC (a special role that means all users) does not have access 
--to objects in our database. This forces users to belong to either the the_list_rw_users role or the_list_r_users role 
--to access the database.
ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  REVOKE ALL PRIVILEGES
  ON TABLES
  FROM PUBLIC;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  REVOKE ALL PRIVILEGES
  ON SEQUENCES
  FROM PUBLIC;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  REVOKE ALL PRIVILEGES
  ON FUNCTIONS
  FROM PUBLIC;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  REVOKE ALL PRIVILEGES
  ON TYPES
  FROM PUBLIC;

ALTER DEFAULT PRIVILEGES
  FOR ROLE the_list_admin
  REVOKE ALL PRIVILEGES
  ON SCHEMAS
  FROM PUBLIC;
--explicitness for readability because not all of the statements above are required. 
--The default privileges for PUBLIC are documented, and a few of the statements above are redundant.
--With these last statements, you will not need to work with GRANTS and ALTER DEFAULT PRIVILEGES again 
--as long as you create users in the the_list_rw_users or the_list_r_users roles.

--Create the the_list_app_users User
--The the_list_app_users user is what your web service will use to connect to the database with. 
--the_list_app_users (usually) requires read and write permissions, so this user belongs to the the_list_rw_users role.

CREATE ROLE the_list_app_users WITH
	LOGIN 
	ENCRYPTED PASSWORD 'password' --remember to change password
	CONNECTION LIMIT 90 
	IN ROLE the_list_rw_users;
ALTER ROLE the_list_app_users SET statement_timeout = 1000;
ALTER ROLE the_list_app_users SET lock_timeout = 750;

-- v9.6+
ALTER ROLE the_list_app_users SET idle_in_transaction_session_timeout = 1000; 
ALTER ROLE the_list_app_users SET search_path = the_list;
--The app user has SELECT, INSERT and UPDATE privileges for all tables created by the owner user