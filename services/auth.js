/**
 * 用户认证服务
 * 处理用户登录、注册、登出等功能
 */

class AuthService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
    }

    /**
     * 初始化认证服务
     */
    async init() {
        this.supabase = window.SupabaseConfig.client();
        if (this.supabase) {
            // 检查当前用户状态
            const { data: { user } } = await this.supabase.auth.getUser();
            this.currentUser = user;
            
            // 监听认证状态变化
            this.supabase.auth.onAuthStateChange((event, session) => {
                this.currentUser = session?.user || null;
                this.handleAuthStateChange(event, session);
            });
        }
    }

    /**
     * 用户注册
     */
    async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: userData // 额外的用户数据
                }
            });

            if (error) throw error;
            
            return {
                success: true,
                data,
                message: '注册成功！请检查邮箱进行验证。'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '注册失败：' + error.message
            };
        }
    }

    /**
     * 用户登录
     */
    async signIn(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            return {
                success: true,
                data,
                message: '登录成功！'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '登录失败：' + error.message
            };
        }
    }

    /**
     * 用户登出
     */
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            return {
                success: true,
                message: '已成功登出'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '登出失败：' + error.message
            };
        }
    }

    /**
     * 获取当前用户
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * 检查用户是否已登录
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * 处理认证状态变化
     */
    handleAuthStateChange(event, session) {
        console.log('认证状态变化:', event, session);
        
        switch (event) {
            case 'SIGNED_IN':
                this.onUserSignedIn(session.user);
                break;
            case 'SIGNED_OUT':
                this.onUserSignedOut();
                break;
            case 'TOKEN_REFRESHED':
                console.log('Token 已刷新');
                break;
        }
    }

    /**
     * 用户登录后的处理
     */
    onUserSignedIn(user) {
        console.log('用户已登录:', user);
        // 可以在这里添加登录后的逻辑，如跳转页面、更新UI等
        this.updateUIForAuthenticatedUser();
    }

    /**
     * 用户登出后的处理
     */
    onUserSignedOut() {
        console.log('用户已登出');
        // 可以在这里添加登出后的逻辑，如清理数据、跳转登录页等
        this.updateUIForUnauthenticatedUser();
    }

    /**
     * 更新已登录用户的UI
     */
    updateUIForAuthenticatedUser() {
        // 隐藏登录/注册按钮，显示用户信息
        const loginElements = document.querySelectorAll('.login-required');
        const logoutElements = document.querySelectorAll('.logout-required');
        
        loginElements.forEach(el => el.style.display = 'none');
        logoutElements.forEach(el => el.style.display = 'block');
    }

    /**
     * 更新未登录用户的UI
     */
    updateUIForUnauthenticatedUser() {
        // 显示登录/注册按钮，隐藏用户信息
        const loginElements = document.querySelectorAll('.login-required');
        const logoutElements = document.querySelectorAll('.logout-required');
        
        loginElements.forEach(el => el.style.display = 'block');
        logoutElements.forEach(el => el.style.display = 'none');
    }

    /**
     * 重置密码
     */
    async resetPassword(email) {
        try {
            const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password.html`
            });

            if (error) throw error;

            return {
                success: true,
                message: '密码重置邮件已发送，请检查邮箱。'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '发送重置邮件失败：' + error.message
            };
        }
    }
}

// 创建全局认证服务实例
window.authService = new AuthService();