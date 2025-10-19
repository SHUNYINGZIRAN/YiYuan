-- 步骤3：创建表结构
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