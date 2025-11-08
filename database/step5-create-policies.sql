-- 步骤5：创建安全策略
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