## STORED PROCEDURE:
```
DELIMITER $$
CREATE PROCEDURE GetCrimeInfo
(
  IN area_name VARCHAR(225)
)
BEGIN
  DECLARE crime_id INT;
  DECLARE type_id INT;

  DECLARE crime_cursor CURSOR FOR SELECT CrimeID, TypeID FROM Crime c NATURAL JOIN Location l NATURAL JOIN CrimeDesc cd WHERE l.AreaName = area_name;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET crime_id = NULL;


  SELECT COUNT(*) INTO @crime_count FROM Crime c NATURAL JOIN Location l WHERE l.AreaName = area_name;

  IF (@crime_count = 0) THEN
    SELECT 'No crimes found for the given area.' AS message;
  ELSE
    OPEN crime_cursor;
    FETCH NEXT FROM crime_cursor INTO crime_id, type_id;

    WHILE (crime_id IS NOT NULL) DO
      SELECT COUNT(*) AS 'Total Count', TypeID, TypeName
      FROM Crime c NATURAL JOIN Location l NATURAL JOIN CrimeDesc cd
      WHERE TypeID = type_id AND l.AreaName = area_name
      GROUP BY TypeID;

      FETCH NEXT FROM crime_cursor INTO crime_id, type_id;
    END WHILE;

    CLOSE crime_cursor;
  END IF;
END $$
DELIMITER ;
```

## TRIGGER:
```
DELIMITER $$
CREATE TRIGGER before_insert
BEFORE INSERT ON Crime 
FOR EACH ROW
BEGIN
    IF NEW.LocationID is NULL OR NEW.LocationID = -1 THEN
        SET NEW.LocationID = 1;
    END IF;
    IF NEW.Time is NULL OR NEW.Time = -1 THEN
        SET NEW.Time = 0000;
    END IF;
    IF NEW.VictimID is NULL THEN
        SET NEW.VictimID = 8;
    END IF;
    IF NEW.TypeID is NULL THEN
        SET NEW.TypeID = 624;
    END IF;
END $$
DELIMITER ;
```
