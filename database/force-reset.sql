-- 强制重置数据库脚本
-- 删除所有策略（只删除存在的表的策略）
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'historical_figures') THEN
        DROP POLICY IF EXISTS "Enable read access for all users" ON historical_figures;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cultural_heritage') THEN
        DROP POLICY IF EXISTS "Enable read access for all users" ON cultural_heritage;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'charity_projects') THEN
        DROP POLICY IF EXISTS "Enable read access for all users" ON charity_projects;
    END IF;
END $$;

-- 强制删除所有表（使用CASCADE确保删除所有依赖）
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS historical_figures CASCADE;
DROP TABLE IF EXISTS cultural_heritage CASCADE;
DROP TABLE IF EXISTS charity_projects CASCADE;

-- 重新创建表结构
-- 用户资料表
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 历史名人表
CREATE TABLE historical_figures (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    dynasty TEXT,
    birth_year INTEGER,
    death_year INTEGER,
    description TEXT,
    achievements TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 非遗项目表
CREATE TABLE cultural_heritage (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    region TEXT,
    description TEXT,
    protection_level TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 公益项目表
CREATE TABLE charity_projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(10,2),
    current_amount DECIMAL(10,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_figures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_heritage ENABLE ROW LEVEL SECURITY;
ALTER TABLE charity_projects ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable read access for all users" ON historical_figures
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON cultural_heritage
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON charity_projects
    FOR SELECT USING (true);

-- 插入测试数据
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