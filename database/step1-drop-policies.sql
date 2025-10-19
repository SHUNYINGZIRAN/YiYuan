-- 步骤1：删除现有策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON historical_figures;
DROP POLICY IF EXISTS "Enable read access for all users" ON cultural_heritage;
DROP POLICY IF EXISTS "Enable read access for all users" ON charity_projects;