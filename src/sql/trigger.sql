-- 시리즈에 게시글 추가할 때 썸네일 추가되는 트리거
DELIMITER $$
 
CREATE TRIGGER update_series_thumbnail
AFTER INSERT  
ON post_series 
FOR EACH ROW 

BEGIN
  DECLARE get_post_thumbnail VARCHAR(3000) DEFAULT '';
  DECLARE get_series_thumbnail VARCHAR(3000) DEFAULT '';
  
  SET get_post_thumbnail = (SELECT thumbnail FROM post WHERE id = (SELECT post_id FROM post_series WHERE id = NEW.id AND sort = 1));
  SET get_series_thumbnail = (SELECT thumbnail FROM series WHERE id = NEW.series_id);
  
  IF get_series_thumbnail IS NULL THEN
  	UPDATE series SET thumbnail = get_post_thumbnail WHERE id = NEW.series_id;
  END IF;
  
END $$
 
DELIMITER ;


-- 게시글 좋아요 취소 count
DELIMITER $$
 
CREATE TRIGGER update_like_count_by_delete
AFTER DELETE
ON post_like 
FOR EACH ROW 
 
BEGIN
  DECLARE get_like_count INT DEFAULT 0;
  SET get_like_count = (SELECT COUNT(*) FROM post_like WHERE post_id = OLD.post_id);
  UPDATE post SET likes = get_like_count WHERE id = OLD.post_id;
END $$
 
DELIMITER ;

-- 게시글 좋아요 count
DELIMITER $$

CREATE TRIGGER update_like_count_by_insert
AFTER INSERT
ON post_like 
FOR EACH ROW 
 
BEGIN
  DECLARE get_like_count INT DEFAULT 0;
  SET get_like_count = (SELECT COUNT(*) FROM post_like WHERE post_id = NEW.post_id);
  UPDATE post SET likes = get_like_count WHERE id = NEW.post_id;
END $$
 
DELIMITER ;

-- 게시글 조회 할 때마다 view_count 합계
DELIMITER $$
 
CREATE TRIGGER update_view_count_by_insert
AFTER INSERT  
ON post_view 
FOR EACH ROW 
 
BEGIN
  DECLARE get_view_count INT DEFAULT 0;
  SET get_view_count = (SELECT SUM(view_count) FROM post_view WHERE post_id = NEW.post_id);
  UPDATE post SET views = get_view_count WHERE id = NEW.post_id;
END $$
 
DELIMITER ;

DELIMITER $$
 
CREATE TRIGGER update_view_count_by_update
AFTER UPDATE  
ON post_view 
FOR EACH ROW 
 
BEGIN
  DECLARE get_view_count INT DEFAULT 0;
  SET get_view_count = (SELECT SUM(view_count) FROM post_view WHERE post_id = NEW.post_id);
  UPDATE post SET views = get_view_count WHERE id = NEW.post_id;
END $$
 
DELIMITER ;