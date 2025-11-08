# YiYuan 项目 Supabase 集成指南

## 概述

本指南详细说明如何将你的 YiYuan 前端项目与 Supabase 后端服务集成，实现完整的全栈应用。

## 项目架构

```
前端 (GitHub Pages)  ←→  Supabase (后端服务)
     ↓                        ↓
- HTML/CSS/JS           - PostgreSQL 数据库
- 用户界面              - 用户认证
- 交互逻辑              - API 接口
                        - 实时数据同步
                        - 文件存储
```

## 集成步骤

### 第一步：Supabase 项目配置

1. **获取项目配置信息**
   - 登录 [Supabase 控制台](https://supabase.com/dashboard)
   - 进入你的"PC端"项目
   - 在 Settings → API 中获取：
     - `Project URL`: `https://your-project-id.supabase.co`
     - `anon public key`: `eyJ...` (公开密钥)

2. **配置项目 URL**
   - 在 `config/supabase.js` 文件中替换配置：
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://your-project-id.supabase.co', // 替换为你的实际 URL
       anonKey: 'your-anon-key' // 替换为你的实际密钥
   };
   ```

### 第二步：数据库设置

1. **执行数据库脚本**
   - 在 Supabase 控制台中，进入 SQL Editor
   - 复制 `database/schema.sql` 中的内容
   - 执行 SQL 脚本创建所有必要的表和安全策略

2. **验证表创建**
   - 在 Table Editor 中确认以下表已创建：
     - `user_profiles` - 用户资料
     - `articles` - 文章
     - `article_comments` - 评论
     - `favorites` - 收藏
     - `historical_figures` - 历史名人
     - `charity_activities` - 公益活动
     - `notifications` - 通知

### 第三步：前端集成

1. **在 HTML 页面中引入必要文件**
   ```html
   <!-- 在 <head> 标签中添加 -->
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="/YiYuan/config/supabase.js"></script>
   <script src="/YiYuan/services/auth.js"></script>
   <script src="/YiYuan/services/database.js"></script>
   ```

2. **初始化服务**
   ```javascript
   document.addEventListener('DOMContentLoaded', async function() {
       // 初始化 Supabase
       window.SupabaseConfig.init();
       
       // 初始化认证服务
       await window.authService.init();
       
       // 初始化数据库服务
       window.databaseService.init();
   });
   ```

### 第四步：功能集成示例

#### 1. 用户认证集成

**登录功能：**
```javascript
async function handleLogin(email, password) {
    const result = await window.authService.signIn(email, password);
    if (result.success) {
        console.log('登录成功');
        // 更新UI，跳转页面等
    } else {
        console.error('登录失败:', result.message);
    }
}
```

**注册功能：**
```javascript
async function handleRegister(email, password, userData) {
    const result = await window.authService.signUp(email, password, userData);
    if (result.success) {
        console.log('注册成功，请检查邮箱验证');
    }
}
```

#### 2. 文章管理集成

**获取文章列表：**
```javascript
async function loadArticles(category = null) {
    const result = await window.databaseService.getArticles(category);
    if (result.success) {
        displayArticles(result.data);
    }
}
```

**创建新文章：**
```javascript
async function createArticle(articleData) {
    const result = await window.databaseService.createArticle(articleData);
    if (result.success) {
        console.log('文章创建成功');
        // 刷新文章列表
    }
}
```

#### 3. 用户资料管理

**获取用户资料：**
```javascript
async function loadUserProfile(userId) {
    const result = await window.databaseService.getUserProfile(userId);
    if (result.success) {
        displayUserProfile(result.data);
    }
}
```

### 第五步：现有页面改造

#### 1. 登录页面改造 (`登录and注册/登录页面.html`)

在现有登录表单的提交事件中集成 Supabase 认证：

```javascript
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = await window.authService.signIn(email, password);
    
    if (result.success) {
        // 登录成功，跳转到主页
        window.location.href = '/YiYuan/index.html';
    } else {
        // 显示错误信息
        alert(result.message);
    }
});
```

#### 2. 主页改造 (`index.html`)

在主页加载时检查用户认证状态：

```javascript
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化服务
    await window.authService.init();
    window.databaseService.init();
    
    // 检查用户登录状态
    const user = window.authService.getCurrentUser();
    if (user) {
        // 用户已登录，显示个人化内容
        loadUserContent();
    } else {
        // 用户未登录，显示默认内容
        loadPublicContent();
    }
    
    // 加载文章数据
    loadArticles();
});
```

#### 3. 文章管理页面改造

将静态文章数据替换为从 Supabase 获取的动态数据：

```javascript
async function loadArticles() {
    const result = await window.databaseService.getArticles();
    
    if (result.success) {
        const articlesContainer = document.querySelector('.articles-grid');
        articlesContainer.innerHTML = '';
        
        result.data.forEach(article => {
            const articleElement = createArticleElement(article);
            articlesContainer.appendChild(articleElement);
        });
    }
}

function createArticleElement(article) {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'article-card';
    articleDiv.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <div class="article-meta">
            <span>作者: ${article.author_name}</span>
            <span>时间: ${new Date(article.created_at).toLocaleDateString()}</span>
            <span>浏览: ${article.view_count}</span>
        </div>
    `;
    return articleDiv;
}
```

## 部署和配置

### GitHub Pages 配置

1. **确保文件结构正确**
   ```
   YiYuan/
   ├── index.html
   ├── config/
   │   └── supabase.js
   ├── services/
   │   ├── auth.js
   │   └── database.js
   ├── examples/
   │   └── integration-example.html
   └── database/
       └── schema.sql
   ```

2. **更新 GitHub Pages 设置**
   - 在 GitHub 仓库设置中启用 GitHub Pages
   - 选择 `main` 分支作为源
   - 确保自定义域名（如果有）正确配置

### Supabase 安全配置

1. **配置允许的域名**
   - 在 Supabase 项目设置中，添加你的 GitHub Pages 域名到允许列表
   - 例如：`https://shunyingziran.github.io`

2. **设置 RLS 策略**
   - 确保所有敏感表都启用了行级安全策略
   - 验证用户只能访问自己的数据

## 测试和验证

### 1. 功能测试

使用 `examples/integration-example.html` 页面测试：
- 用户注册和登录
- 文章创建和查看
- 数据库连接状态

### 2. 安全测试

- 验证未登录用户无法访问受保护的数据
- 确认用户只能修改自己的内容
- 测试 API 密钥的安全性

## 常见问题解决

### 1. CORS 错误
如果遇到跨域问题，在 Supabase 项目设置中添加你的域名到 CORS 允许列表。

### 2. 认证失败
检查 Supabase 配置是否正确，确保 URL 和密钥匹配。

### 3. 数据库连接问题
验证数据库表是否正确创建，RLS 策略是否正确配置。

## 下一步优化建议

1. **性能优化**
   - 实现数据缓存机制
   - 添加图片懒加载
   - 优化数据库查询

2. **功能扩展**
   - 添加实时评论功能
   - 实现文件上传
   - 集成搜索功能

3. **用户体验**
   - 添加加载状态指示器
   - 实现离线功能
   - 优化移动端体验

## 技术支持

如果在集成过程中遇到问题，可以：
1. 查看 Supabase 官方文档
2. 检查浏览器控制台错误信息
3. 验证数据库表结构和权限设置

---

通过以上步骤，你的 YiYuan 项目将成功集成 Supabase 后端服务，实现完整的全栈功能。