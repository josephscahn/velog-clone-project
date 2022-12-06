-- 게시글을 시리즈에 추가할 때 post_series의 sort 가져오기.
DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_post_series_sort`(
	`SET_SERIES_ID` INT
)
RETURNS int
LANGUAGE SQL
NOT DETERMINISTIC
CONTAINS SQL
SQL SECURITY DEFINER
COMMENT ''
BEGIN

	DECLARE post_series_sort INT DEFAULT 1;
	DECLARE get_post_count INT DEFAULT 0;
  	SET get_post_count = (SELECT COUNT(*) FROM post_series WHERE series_id = SET_SERIES_ID);
  	
  	IF get_post_count > 1 THEN
  		SET post_series_sort = (SELECT sort FROM post_series WHERE series_id = SET_SERIES_ID ORDER BY sort DESC LIMIT 1) + 1;
  	END IF;
	
	RETURN post_series_sort;
END
DELIMITER ;