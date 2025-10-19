/**
 * YiYuan 项目 Supabase 集成快速设置脚本
 * 在浏览器控制台中运行此脚本来快速配置项目
 */

class YiYuanSetup {
    constructor() {
        this.config = {
            supabaseUrl: '',
            supabaseKey: '',
            projectName: 'YiYuan',
            version: '1.0.0'
        };
    }

    /**
     * 初始化设置向导
     */
    async init() {
        console.log('🚀 YiYuan 项目 Supabase 集成设置向导');
        console.log('=====================================');
        
        // 检查环境
        this.checkEnvironment();
        
        // 配置向导
        await this.configurationWizard();
        
        // 测试连接
        await this.testConnection();
        
        // 生成配置文件
        this.generateConfigFile();
        
        console.log('✅ 设置完成！');
    }

    /**
     * 检查运行环境
     */
    checkEnvironment() {
        console.log('🔍 检查运行环境...');
        
        // 检查是否在浏览器环境中
        if (typeof window === 'undefined') {
            console.error('❌ 此脚本需要在浏览器环境中运行');
            return false;
        }
        
        // 检查是否已加载 Supabase SDK
        if (typeof supabase === 'undefined') {
            console.warn('⚠️  Supabase SDK 未加载，请先引入 Supabase CDN');
            console.log('请在 HTML 中添加: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
            return false;
        }
        
        console.log('✅ 环境检查通过');
        return true;
    }

    /**
     * 配置向导
     */
    async configurationWizard() {
        console.log('⚙️  开始配置向导...');
        
        // 获取 Supabase 配置
        this.config.supabaseUrl = prompt('请输入你的 Supabase 项目 URL:') || '';
        this.config.supabaseKey = prompt('请输入你的 Supabase anon key:') || '';
        
        if (!this.config.supabaseUrl || !this.config.supabaseKey) {
            console.error('❌ 配置信息不完整，请重新运行设置');
            return false;
        }
        
        console.log('✅ 配置信息已收集');
        return true;
    }

    /**
     * 测试 Supabase 连接
     */
    async testConnection() {
        console.log('🔗 测试 Supabase 连接...');
        
        try {
            const client = supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
            
            // 测试连接
            const { data, error } = await client.from('articles').select('count', { count: 'exact', head: true });
            
            if (error && error.code !== 'PGRST116') { // PGRST116 表示表不存在，这是正常的
                throw error;
            }
            
            console.log('✅ Supabase 连接测试成功');
            return true;
        } catch (error) {
            console.error('❌ Supabase 连接测试失败:', error.message);
            return false;
        }
    }

    /**
     * 生成配置文件内容
     */
    generateConfigFile() {
        console.log('📝 生成配置文件...');
        
        const configContent = `/**
 * Supabase 配置文件 - 自动生成
 * 生成时间: ${new Date().toLocaleString()}
 */

const SUPABASE_CONFIG = {
    url: '${this.config.supabaseUrl}',
    anonKey: '${this.config.supabaseKey}'
};

// 创建 Supabase 客户端
let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('Supabase 客户端初始化成功');
        return supabaseClient;
    } else {
        console.error('Supabase SDK 未加载');
        return null;
    }
}

function getSupabaseClient() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

window.SupabaseConfig = {
    config: SUPABASE_CONFIG,
    client: getSupabaseClient,
    init: initSupabase
};`;

        console.log('📋 配置文件内容已生成，请复制以下内容到 config/supabase.js:');
        console.log('=====================================');
        console.log(configContent);
        console.log('=====================================');
        
        // 尝试下载配置文件
        this.downloadConfigFile(configContent);
    }

    /**
     * 下载配置文件
     */
    downloadConfigFile(content) {
        try {
            const blob = new Blob([content], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'supabase.js';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('💾 配置文件已自动下载');
        } catch (error) {
            console.log('⚠️  自动下载失败，请手动复制配置内容');
        }
    }

    /**
     * 验证数据库表结构
     */
    async validateDatabaseSchema() {
        console.log('🗄️  验证数据库表结构...');
        
        const requiredTables = [
            'user_profiles',
            'articles', 
            'article_comments',
            'favorites',
            'historical_figures',
            'charity_activities',
            'notifications'
        ];
        
        const client = supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
        
        for (const table of requiredTables) {
            try {
                const { error } = await client.from(table).select('*').limit(1);
                if (error) {
                    console.warn(`⚠️  表 ${table} 不存在或无法访问`);
                } else {
                    console.log(`✅ 表 ${table} 验证通过`);
                }
            } catch (error) {
                console.warn(`⚠️  表 ${table} 验证失败:`, error.message);
            }
        }
    }

    /**
     * 生成示例数据
     */
    async generateSampleData() {
        console.log('📊 生成示例数据...');
        
        const client = supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
        
        // 示例历史名人数据
        const sampleFigures = [
            {
                name: '李白',
                dynasty: '唐朝',
                birth_year: 701,
                death_year: 762,
                description: '唐代伟大的浪漫主义诗人',
                category: 'poet'
            },
            {
                name: '孔子',
                dynasty: '春秋',
                birth_year: -551,
                death_year: -479,
                description: '中国古代思想家、教育家',
                category: 'philosopher'
            }
        ];
        
        try {
            const { error } = await client.from('historical_figures').insert(sampleFigures);
            if (error) {
                console.warn('⚠️  示例数据插入失败:', error.message);
            } else {
                console.log('✅ 示例数据生成成功');
            }
        } catch (error) {
            console.warn('⚠️  生成示例数据时出错:', error.message);
        }
    }

    /**
     * 显示帮助信息
     */
    showHelp() {
        console.log(`
🎯 YiYuan 项目集成指南

1. 基本设置:
   const setup = new YiYuanSetup();
   await setup.init();

2. 验证数据库:
   await setup.validateDatabaseSchema();

3. 生成示例数据:
   await setup.generateSampleData();

4. 显示帮助:
   setup.showHelp();

📚 更多信息请查看 README-Supabase集成指南.md
        `);
    }
}

// 创建全局实例
window.YiYuanSetup = YiYuanSetup;

// 自动显示帮助信息
console.log('🎯 YiYuan 设置脚本已加载');
console.log('运行 "const setup = new YiYuanSetup(); await setup.init();" 开始设置');
console.log('或运行 "new YiYuanSetup().showHelp()" 查看帮助');

// 导出设置类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YiYuanSetup;
}