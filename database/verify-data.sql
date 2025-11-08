-- 验证数据插入情况
SELECT 'historical_figures' as table_name, count(*) as record_count FROM historical_figures
UNION ALL
SELECT 'cultural_heritage' as table_name, count(*) as record_count FROM cultural_heritage
UNION ALL
SELECT 'charity_projects' as table_name, count(*) as record_count FROM charity_projects;

-- 查看具体数据
SELECT '=== 历史名人 ===' as section;
SELECT name, dynasty, birth_year, death_year FROM historical_figures;

SELECT '=== 文化遗产 ===' as section;
SELECT name, category, region, protection_level FROM cultural_heritage;

SELECT '=== 公益项目 ===' as section;
SELECT title, target_amount, current_amount, status FROM charity_projects;