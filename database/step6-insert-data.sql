-- 步骤6：插入测试数据
INSERT INTO historical_figures (name, dynasty, birth_year, death_year, description, achievements) VALUES
('孔子', '春秋', -551, -479, '中国古代思想家、教育家，儒家学派创始人', ARRAY['创立儒家学说', '编订六经', '有教无类']),
('李白', '唐', 701, 762, '唐代伟大的浪漫主义诗人', ARRAY['诗仙美誉', '创作千余首诗歌', '影响后世文学']),
('苏轼', '宋', 1037, 1101, '北宋文学家、书画家、美食家', ARRAY['唐宋八大家之一', '豪放派词人', '文学成就卓著']);

INSERT INTO cultural_heritage (name, category, region, description, protection_level) VALUES
('京剧', '传统戏曲', '北京', '中国传统戏曲剧种，被誉为国粹', '国家级'),
('太极拳', '传统武术', '全国', '中国传统内家拳术，注重以柔克刚', '世界级'),
('书法', '传统艺术', '全国', '汉字书写艺术，体现中华文化精髓', '国家级');

INSERT INTO charity_projects (title, description, target_amount, current_amount, start_date, end_date) VALUES
('传统文化进校园', '推广传统文化教育，让更多孩子了解中华文化', 100000.00, 25000.00, '2024-01-01', '2024-12-31'),
('非遗传承人扶持计划', '资助非遗传承人，保护传统技艺', 200000.00, 80000.00, '2024-03-01', '2024-11-30'),
('历史文物数字化保护', '利用数字技术保护珍贵历史文物', 150000.00, 45000.00, '2024-02-01', '2024-10-31');