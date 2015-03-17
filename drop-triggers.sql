-- Database: "QueixasNaNetDB"

-- DROP DATABASE "QueixasNaNetDB";

CREATE DATABASE "QueixasNaNetDB"
  WITH OWNER = "queixaUser"
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'Portuguese_Portugal.1252'
       LC_CTYPE = 'Portuguese_Portugal.1252'
       CONNECTION LIMIT = -1;

--Drops
drop table COMPLAIN_VIEW;
drop table COMPLAIN_FOLLOW;
drop table COMPLAIN_VOTE;
drop table COMMENT;
drop table COMPLAIN;
drop table USER_COMPLAIN;
drop table CATEGORY;
drop table LOCATION_COMPLAIN;

--triggers
CREATE OR REPLACE FUNCTION change_id_comment() 
RETURNS trigger
AS $change_id_comment$
DECLARE ID_aux integer;
BEGIN
	SELECT INTO ID_aux MAX(ID) FROM COMMENT WHERE ID_COMPLAIN = NEW.ID_COMPLAIN GROUP BY ID_COMPLAIN;
	UPDATE COMMENT SET ID=ID_aux+1 WHERE ID_PK=NEW.ID_PK;
	RETURN NEW;
END;
$change_id_comment$ LANGUAGE plpgsql;

CREATE TRIGGER change_id_comment
AFTER INSERT ON COMMENT
FOR EACH ROW EXECUTE PROCEDURE change_id_comment();
--DROP FUNCTION change_id_comment();

CREATE OR REPLACE FUNCTION toggle_vote() 
RETURNS trigger
AS $toggle_vote$
BEGIN
	DELETE FROM COMPLAIN_VOTE WHERE USER_VOTE = NEW.USER_VOTE AND ID_VOTE = NEW.ID_VOTE AND VOTE <> NEW.VOTE;
	RETURN NEW;
END;
$toggle_vote$ LANGUAGE plpgsql;

CREATE TRIGGER toggle_vote
AFTER INSERT ON COMPLAIN_VOTE
FOR EACH ROW EXECUTE PROCEDURE toggle_vote();
--DROP FUNCTION toggle_vote();