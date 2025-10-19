/**
 * 数据库服务
 * 处理与 Supabase 数据库的交互
 */

class DatabaseService {
    constructor() {
        this.supabase = null;
    }

    /**
     * 初始化数据库服务
     */
    init() {
        this.supabase = window.SupabaseConfig.client();
    }

    /**
     * 文章相关操作
     */
    
    // 获取所有文章
    async getArticles(category = null, limit = 50, offset = 0) {
        try {
            let query = this.supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;
            
            if (error) throw error;

            return {
                success: true,
                data,
                message: '文章获取成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '获取文章失败：' + error.message
            };
        }
    }

    // 根据ID获取单篇文章
    async getArticleById(id) {
        try {
            const { data, error } = await this.supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                success: true,
                data,
                message: '文章获取成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '获取文章失败：' + error.message
            };
        }
    }

    // 创建新文章
    async createArticle(articleData) {
        try {
            const { data, error } = await this.supabase
                .from('articles')
                .insert([{
                    ...articleData,
                    author_id: window.authService.getCurrentUser()?.id,
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: '文章创建成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '创建文章失败：' + error.message
            };
        }
    }

    // 更新文章
    async updateArticle(id, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('articles')
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: '文章更新成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '更新文章失败：' + error.message
            };
        }
    }

    // 删除文章
    async deleteArticle(id) {
        try {
            const { error } = await this.supabase
                .from('articles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return {
                success: true,
                message: '文章删除成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '删除文章失败：' + error.message
            };
        }
    }

    /**
     * 用户相关操作
     */
    
    // 获取用户资料
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            return {
                success: true,
                data,
                message: '用户资料获取成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '获取用户资料失败：' + error.message
            };
        }
    }

    // 更新用户资料
    async updateUserProfile(userId, profileData) {
        try {
            const { data, error } = await this.supabase
                .from('user_profiles')
                .upsert({
                    user_id: userId,
                    ...profileData,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: '用户资料更新成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '更新用户资料失败：' + error.message
            };
        }
    }

    /**
     * 收藏相关操作
     */
    
    // 获取用户收藏
    async getUserFavorites(userId, category = null) {
        try {
            let query = this.supabase
                .from('favorites')
                .select(`
                    *,
                    articles (*)
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (category) {
                query = query.eq('articles.category', category);
            }

            const { data, error } = await query;
            
            if (error) throw error;

            return {
                success: true,
                data,
                message: '收藏获取成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '获取收藏失败：' + error.message
            };
        }
    }

    // 添加收藏
    async addToFavorites(userId, articleId) {
        try {
            const { data, error } = await this.supabase
                .from('favorites')
                .insert([{
                    user_id: userId,
                    article_id: articleId,
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;

            return {
                success: true,
                data: data[0],
                message: '添加收藏成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '添加收藏失败：' + error.message
            };
        }
    }

    // 取消收藏
    async removeFromFavorites(userId, articleId) {
        try {
            const { error } = await this.supabase
                .from('favorites')
                .delete()
                .eq('user_id', userId)
                .eq('article_id', articleId);

            if (error) throw error;

            return {
                success: true,
                message: '取消收藏成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '取消收藏失败：' + error.message
            };
        }
    }

    /**
     * 通用查询方法
     */
    async query(table, options = {}) {
        try {
            let query = this.supabase.from(table);

            // 应用查询选项
            if (options.select) {
                query = query.select(options.select);
            } else {
                query = query.select('*');
            }

            if (options.filter) {
                Object.entries(options.filter).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }

            if (options.order) {
                query = query.order(options.order.column, { 
                    ascending: options.order.ascending !== false 
                });
            }

            if (options.limit) {
                query = query.limit(options.limit);
            }

            if (options.range) {
                query = query.range(options.range.from, options.range.to);
            }

            const { data, error } = await query;
            
            if (error) throw error;

            return {
                success: true,
                data,
                message: '查询成功'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: '查询失败：' + error.message
            };
        }
    }
}

// 创建全局数据库服务实例
window.databaseService = new DatabaseService();