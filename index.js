// 简单的交互效果
document.addEventListener('DOMContentLoaded', function () {
    // 导航项点击效果和内容切换
    const navItems = document.querySelectorAll('.nav-item');
    const contentItems = document.querySelectorAll('.zong > li');
    const editProfileNav = document.getElementById('editProfileNav'); // 编辑资料导航项

    // 默认显示第一个内容区域（历史），隐藏其他区域
    contentItems.forEach((item, index) => {
        if (index !== 0) {
            item.style.display = 'none';
        }
    });

    // 放弃编辑并返回到"我的"页面
    function cancelEdit() {
        // 隐藏编辑资料导航项
        editProfileNav.style.display = 'none';

        // 隐藏编辑资料页面
        document.querySelector('.zong .wu').style.display = 'none';

        // 显示"我的"页面
        const myContent = document.querySelector('.zong .si');
        myContent.style.display = 'block';

        // 滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // 更新导航项样式
        navItems.forEach(i => i.classList.remove('active'));
        navItems[3].classList.add('active'); // "我的"导航项
    }

    // 导航项点击事件
    navItems.forEach((item, index) => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // 如果当前正在编辑资料，且点击的不是"编辑资料"导航项，则放弃编辑
            if (editProfileNav.style.display === 'inline-block' && this !== editProfileNav) {
                if (confirm('切换页面将放弃所有未保存的更改，是否继续？')) {
                    // 隐藏编辑资料导航项
                    editProfileNav.style.display = 'none';
                } else {
                    return; // 取消切换
                }
            }

            // 更新导航项样式
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // 隐藏所有内容区域
            contentItems.forEach(content => {
                content.style.display = 'none';
            });

            // 根据点击的导航项显示对应内容
            if (this === editProfileNav) { // 编辑资料
                document.querySelector('.zong .wu').style.display = 'block';
            } else if (index === 0) { // 历史
                document.querySelector('.zong .yi').style.display = 'block';
            } else if (index === 1) { // 非遗
                document.querySelector('.zong .er').style.display = 'block';
            } else if (index === 2) { // 公益
                document.querySelector('.zong .san').style.display = 'block';
            } else if (index === 3) { // 我的
                // 强制刷新"我的"页面内容样式
                const myContent = document.querySelector('.zong .si');
                myContent.style.display = 'none';

                // 重置filter-btn的active状态
                const resetFilterButtons = (containerClass) => {
                    const container = myContent.querySelector(containerClass);
                    if (container) {
                        const filterButtons = container.querySelectorAll('.filter-btn');
                        filterButtons.forEach((btn, i) => {
                            btn.classList.remove('active');
                            // 将第一个按钮设为active（通常是"全部"按钮）
                            if (i === 0) {
                                btn.classList.add('active');
                            }
                        });
                        // 更新状态记录
                        if (filterButtons.length > 0) {
                            filterStates[container.className] = filterButtons[0].textContent.trim();
                        }
                    }
                };

                // 重置所有三个区域的filter-btn
                resetFilterButtons('.main-content-three'); // 收藏
                resetFilterButtons('.main-content-four');  // 文章管理
                resetFilterButtons('.main-content-five');  // 消息通知

                // 通过短暂隐藏再显示来触发样式刷新
                setTimeout(() => {
                    myContent.style.display = 'block';
                }, 10);
            } else if (index === 5) { // 店肆
                // 显示店肆页面
                document.querySelector('.zong .liu').style.display = 'block';
            }
        });
    });

    // 编辑资料按钮点击事件
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function () {
            // 显示编辑资料导航项
            editProfileNav.style.display = 'inline-block';

            // 更新导航项样式
            navItems.forEach(i => i.classList.remove('active'));
            editProfileNav.classList.add('active');

            // 隐藏所有内容区域
            contentItems.forEach(content => {
                content.style.display = 'none';
            });

            // 显示编辑资料页面
            document.querySelector('.zong .wu').style.display = 'block';
        });
    }

    // 保存资料按钮点击事件
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            alert('资料修改成功！');
            cancelEdit();
        });
    }

    // 保存更改按钮点击事件
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function () {
            alert('资料修改成功！');
            cancelEdit();
        });
    }

    // 放弃更改按钮点击事件
    const discardBtn = document.getElementById('discardBtn');
    if (discardBtn) {
        discardBtn.addEventListener('click', function () {
            if (confirm('确定要放弃所有更改吗？')) {
                cancelEdit();
            }
        });
    }

    // 取消按钮点击事件
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
            if (confirm('确定要放弃所有更改吗？')) {
                cancelEdit();
            }
        });
    }

    // 卡片悬停效果
    const cards = document.querySelectorAll('.article-card, .figure-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // 筛选按钮点击效果
    const filterStates = {}; // 记录每个区域的筛选状态

    function updateFilterButtons(container) {
        const filterButtons = container.querySelectorAll('.filter-btn');
        const currentState = filterStates[container.id || container.className];

        filterButtons.forEach(button => {
            button.classList.remove('active');
            if (currentState && button.textContent.trim() === currentState) {
                button.classList.add('active');
            } else if (!currentState && button.classList.contains('active')) {
                // 保持默认的"全部"状态
                button.classList.add('active');
            }
        });
    }

    // 初始化所有区域的筛选按钮
    document.querySelectorAll('.main-content-three, .main-content-four, .main-content-five').forEach(container => {
        const filterButtons = container.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // 移除当前区域所有按钮的active类
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // 为当前点击的按钮添加active类
                this.classList.add('active');
                // 记录当前区域的筛选状态
                filterStates[container.id || container.className] = this.textContent.trim();
            });
        });

        // 初始化默认状态
        const defaultActive = container.querySelector('.filter-btn.active');
        if (defaultActive) {
            filterStates[container.id || container.className] = defaultActive.textContent.trim();
        }
    });

    // 在切换主内容区域时恢复筛选状态
    navItems.forEach((item, index) => {
        item.addEventListener('click', function (e) {
            // 原有切换逻辑...

            // 恢复当前区域的筛选状态
            const currentContent = document.querySelector(`.zong > li:nth-child(${index + 1})`);
            if (currentContent) {
                const filterContainer = currentContent.querySelector('.main-content-three, .main-content-four, .main-content-five');
                if (filterContainer) {
                    updateFilterButtons(filterContainer);
                }
            }
        });
    });

    // 搜索功能
    const searchBox = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', function () {
        if (searchBox.value.trim() !== '') {
            alert(`搜索: ${searchBox.value}`);
            searchBox.value = '';
        }
    });

    searchBox.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            alert(`搜索: ${this.value}`);
            this.value = '';
        }
    });

    // 初始化轮播
    initHistoryFiguresCarousel();
    initMastersCarousel();
});

/**
 * 历史人物轮播效果
 * 实现从右向左匀速轮播效果
 */
function initHistoryFiguresCarousel() {
    // 获取历史人物轮播容器
    const historyContainers = document.querySelectorAll('.figures-container:not(.masters-container)');

    historyContainers.forEach(container => {
        // 获取所有历史人物卡片及其父元素（a标签）
        const cardLinks = Array.from(container.querySelectorAll('a'));
        if (!cardLinks.length) return;

        // 创建一个内部容器来包裹所有卡片
        const innerContainer = document.createElement('div');
        innerContainer.className = 'carousel-inner history-carousel';

        // 将所有卡片移动到内部容器
        cardLinks.forEach(link => {
            container.removeChild(link);
            innerContainer.appendChild(link);
        });

        // 将内部容器添加到主容器
        container.appendChild(innerContainer);

        // 修改容器样式以支持轮播，保持高度自适应
        container.style.display = 'block';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.width = '100%';

        // 修改内部容器样式
        innerContainer.style.display = 'flex';
        innerContainer.style.position = 'relative';
        innerContainer.style.width = 'max-content';

        // 计算每个卡片的宽度和外边距
        const cardWidth = 250; // 根据原始的minmax设置
        const cardMargin = 25; // 根据原始的gap设置
        const totalCardWidth = cardWidth + cardMargin;

        // 设置卡片样式
        cardLinks.forEach(link => {
            link.style.flex = '0 0 auto';
            link.style.width = `${cardWidth}px`;
            link.style.marginRight = `${cardMargin}px`;

            // 保持卡片内部样式不变
            const card = link.querySelector('.figure-card');
            if (card) {
                card.style.width = '100%';
                card.style.margin = '0';
            }
        });

        // 克隆卡片以实现无缝轮播
        const cloneLinks = cardLinks.map(link => {
            const clone = link.cloneNode(true);
            innerContainer.appendChild(clone);
            return clone;
        });

        // 设置动画参数
        let position = 0;
        const speed = 0.5; // 每帧移动的像素数，可以调整速度
        let animationId = null;
        const totalOriginalCards = cardLinks.length;
        const totalCardsWidth = totalOriginalCards * totalCardWidth;

        // 动画函数
        function animate() {
            position -= speed;

            // 当第一组卡片完全移出视野时，重置位置
            if (position <= -totalCardsWidth) {
                // 重置位置到第一组克隆卡片的起始位置
                position += totalCardsWidth;

                // 强制重排，确保重置位置后立即更新显示
                innerContainer.style.transition = 'none';
                innerContainer.style.transform = `translateX(${position}px)`;

                // 下一帧恢复动画
                requestAnimationFrame(() => {
                    innerContainer.style.transition = '';
                });
            }

            // 应用位置
            innerContainer.style.transform = `translateX(${position}px)`;

            // 继续动画
            animationId = requestAnimationFrame(animate);
        }

        // 当鼠标悬停在容器上时暂停动画
        container.addEventListener('mouseenter', function () {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });

        // 当鼠标离开容器时恢复动画
        container.addEventListener('mouseleave', function () {
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        });

        // 启动动画
        animationId = requestAnimationFrame(animate);
    });
}

/**
 * 非遗传承人轮播效果
 * 实现从右向左匀速轮播效果
 */
function initMastersCarousel() {
    // 获取非遗传承人轮播容器
    const mastersContainers = document.querySelectorAll('.masters-container');

    mastersContainers.forEach(container => {
        // 获取所有非遗传承人卡片及其父元素（a标签）
        const cardLinks = Array.from(container.querySelectorAll('a'));
        if (!cardLinks.length) return;

        // 创建一个内部容器来包裹所有卡片
        const innerContainer = document.createElement('div');
        innerContainer.className = 'carousel-inner masters-carousel';

        // 将所有卡片移动到内部容器
        cardLinks.forEach(link => {
            container.removeChild(link);
            innerContainer.appendChild(link);
        });

        // 将内部容器添加到主容器
        container.appendChild(innerContainer);

        // 修改容器样式以支持轮播，保持高度自适应
        container.style.display = 'block';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.width = '100%';

        // 修改内部容器样式
        innerContainer.style.display = 'flex';
        innerContainer.style.position = 'relative';
        innerContainer.style.width = 'max-content';

        // 计算每个卡片的宽度和外边距
        const cardWidth = 280; // 非遗传承人卡片宽度
        const cardMargin = 25; // 根据原始的gap设置
        const totalCardWidth = cardWidth + cardMargin;

        // 设置卡片样式
        cardLinks.forEach(link => {
            link.style.flex = '0 0 auto';
            link.style.width = `${cardWidth}px`;
            link.style.marginRight = `${cardMargin}px`;

            // 保持卡片内部样式不变
            const card = link.querySelector('.master-card');
            if (card) {
                card.style.width = '100%';
                card.style.margin = '0';
            }
        });

        // 克隆卡片以实现无缝轮播 - 修复：确保有足够多的克隆卡片
        // 克隆两组卡片，确保在重置时有足够的内容显示
        for (let i = 0; i < 2; i++) {
            cardLinks.forEach(link => {
                const clone = link.cloneNode(true);
                innerContainer.appendChild(clone);
            });
        }

        // 设置动画参数
        let position = 0;
        const speed = 0.4; // 非遗传承人轮播速度略慢
        let animationId = null;
        const totalOriginalCards = cardLinks.length;
        const totalCardsWidth = totalOriginalCards * totalCardWidth;

        // 动画函数 - 修复：更精确的重置逻辑
        function animate() {
            position -= speed;

            // 当第一组卡片完全移出视野时，重置位置
            // 修复：使用更精确的重置条件
            if (position <= -totalCardsWidth) {
                // 重置位置到第一组克隆卡片的起始位置
                position += totalCardsWidth;

                // 强制重排，确保重置位置后立即更新显示
                innerContainer.style.transition = 'none';
                innerContainer.style.transform = `translateX(${position}px)`;

                // 下一帧恢复动画
                requestAnimationFrame(() => {
                    innerContainer.style.transition = '';
                });
            }

            // 应用位置
            innerContainer.style.transform = `translateX(${position}px)`;

            // 继续动画
            animationId = requestAnimationFrame(animate);
        }

        // 当鼠标悬停在容器上时暂停动画
        container.addEventListener('mouseenter', function () {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });

        // 当鼠标离开容器时恢复动画
        container.addEventListener('mouseleave', function () {
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        });

        // 启动动画
        animationId = requestAnimationFrame(animate);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // 导航项点击效果
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 匠人商店标签切换
    const storeTabs = document.querySelectorAll('.store-tab');
    const storeContents = document.querySelectorAll('.store-content');

    storeTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // 更新标签状态
            storeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 更新内容显示
            storeContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}Content`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // 商品操作按钮 - 只针对产品卡片内部的按钮
    const productBtns = document.querySelectorAll('.product-card .product-actions .product-btn');
    productBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // 阻止事件冒泡和默认行为，避免a标签跳转
            e.preventDefault();
            e.stopPropagation();

            const action = this.textContent;
            const productTitle = this.closest('.product-card').querySelector('.product-title').textContent;

            if (action === '收藏' || action === '取消收藏') {
                alert(`${action}商品: ${productTitle}`);
            } else if (action === '点击购买') {
                alert(`恭喜您！已成功购买"${productTitle}"`);
            }
        });
    });

    // 分类筛选按钮
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 搜索功能
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', function () {
        const keyword = searchInput.value;
        if (keyword.trim() !== '') {
            alert(`搜索关键词: ${keyword}`);
        }
    });

    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            const keyword = searchInput.value;
            if (keyword.trim() !== '') {
                alert(`搜索关键词: ${keyword}`);
            }
        }
    });
});

/**
 * 页尾交互效果
 * 为"我们一起回家吧"页尾添加动态交互
 */
function initFooterInteractions() {
    // 探索卡片悬停效果
    const exploreCards = document.querySelectorAll('.explore-card');
    exploreCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 探索分类功能
    function exploreCategory(category) {
        let categoryName = "";
        switch(category) {
            case 'history':
                categoryName = "历史长廊";
                break;
            case 'culture':
                categoryName = "非遗之美";
                break;
            case 'welfare':
                categoryName = "公益温暖";
                break;
            case 'community':
                categoryName = "同好社区";
                break;
        }
        alert(`即将带您探索 ${categoryName}，请稍候...`);
        // 实际应用中这里应该跳转到相应页面
    }
    
    // 开启探索之旅
    function startJourney() {
        alert("欢迎开启探索之旅！我们将带您领略传统文化与公益的精彩世界。");
        // 实际应用中这里可以跳转到引导页面或首页
    }
    
    // 了解更多
    function learnMore() {
        alert("了解更多关于云间文苑的信息，请查看我们的介绍页面。");
        // 实际应用中这里可以跳转到关于我们页面
    }

    // 绑定事件
    document.querySelectorAll('.explore-card').forEach((card, index) => {
        const categories = ['history', 'culture', 'welfare', 'community'];
        card.addEventListener('click', function() {
            exploreCategory(categories[index]);
        });
    });

    const actionBtns = document.querySelectorAll('.action-btn');
    if (actionBtns[0]) {
        actionBtns[0].addEventListener('click', startJourney);
    }
    if (actionBtns[1]) {
        actionBtns[1].addEventListener('click', learnMore);
    }

    // 添加装饰元素的动画效果
    const decorations = document.querySelectorAll('.decoration');
    decorations.forEach((decoration, index) => {
        decoration.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite alternate`;
    });

    // 添加浮动动画关键帧
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0px) rotate(var(--rotation, 0deg)); }
            100% { transform: translateY(-20px) rotate(var(--rotation, 0deg)); }
        }
    `;
    document.head.appendChild(style);

    // 为每个装饰元素设置不同的旋转角度
    decorations[0].style.setProperty('--rotation', '-10deg');
    decorations[1].style.setProperty('--rotation', '15deg');
    decorations[2].style.setProperty('--rotation', '5deg');
    decorations[3].style.setProperty('--rotation', '-8deg');
}
