/**
 * Supabase 配置文件
 * 用于连接 Supabase 后端服务
 */

// Supabase 项目配置 - 请替换为你的实际配置
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_PROJECT_URL', // 替换为你的 Supabase 项目 URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // 替换为你的 Supabase anon key
};

// 创建 Supabase 客户端
let supabaseClient = null;

/**
 * 初始化 Supabase 客户端
 */
function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('Supabase 客户端初始化成功');
        return supabaseClient;
    } else {
        console.error('Supabase SDK 未加载，请确保已引入 Supabase CDN');
        return null;
    }
}

/**
 * 获取 Supabase 客户端实例
 */
function getSupabaseClient() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

// 导出配置和客户端
window.SupabaseConfig = {
    config: SUPABASE_CONFIG,
    client: getSupabaseClient,
    init: initSupabase
};