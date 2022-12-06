-- post_series 삭제 할 떄 트리거
DELIMITER $$
 
CREATE TRIGGER update_post_count_by_delete
AFTER DELETE  
ON post_series 
FOR EACH ROW 
 
BEGIN
  DECLARE get_post_count INT DEFAULT 0;
  SET get_post_count = (SELECT COUNT(*) FROM post_series WHERE series_id = OLD.series_id);
  UPDATE series SET post_count = get_post_count WHERE id = OLD.series_id;
END $$
 
DELIMITER ;


-- post_series insert 할 때 트리거
DELIMITER $$
 
CREATE TRIGGER update_post_count_by_insert
AFTER INSERT  
ON post_series 
FOR EACH ROW 
 
BEGIN
  DECLARE get_post_count INT DEFAULT 0;
  SET get_post_count = (SELECT COUNT(*) FROM post_series WHERE series_id = NEW.series_id);
  UPDATE series SET post_count = get_post_count WHERE id = NEW.series_id;
END $$
 
DELIMITER ;


-- 댓글 작성 할 때 트리거
DELIMITER $$
 
CREATE TRIGGER update_comment_count_by_insert
AFTER INSERT  
ON comments 
FOR EACH ROW 
 
BEGIN
  DECLARE get_comment_count INT DEFAULT 0;
  SET get_comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = NEW.post_id);
  UPDATE post SET comment_count = get_comment_count WHERE id = NEW.post_id;
END $$
 
DELIMITER ;


-- 댓글 삭제 할 때 트리거
DELIMITER $$
 
CREATE TRIGGER update_comment_count_by_delete
AFTER DELETE  
ON comments 
FOR EACH ROW 
 
BEGIN
  DECLARE get_comment_count INT DEFAULT 0;
  SET get_comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = OLD.post_id);
  UPDATE post SET comment_count = get_comment_count WHERE id = OLD.post_id;
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


-- post_tag 삭제 할 떄 트리거
DELIMITER $$
 
CREATE TRIGGER update_tag_post_count_by_delete
AFTER DELETE  
ON post_tag 
FOR EACH ROW 
 
BEGIN
  DECLARE get_post_count INT DEFAULT 0;
  SET get_post_count = (SELECT COUNT(*) FROM post_tag WHERE tag_id = OLD.tag_id);
  UPDATE tag SET post_count = get_post_count WHERE id = OLD.tag_id;
END $$
 
DELIMITER ;


-- post_tag insert 할 때 트리거
DELIMITER $$
 
CREATE TRIGGER update_tag_post_count_by_insert
AFTER INSERT  
ON post_tag 
FOR EACH ROW 
 
BEGIN
  DECLARE get_post_count INT DEFAULT 0;
  SET get_post_count = (SELECT COUNT(*) FROM post_tag WHERE tag_id = NEW.tag_id);
  UPDATE tag SET post_count = get_post_count WHERE id = NEW.tag_id;
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