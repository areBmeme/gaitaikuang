// 页面导航功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有导航链接和页面
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    // 页面切换功能
    function showPage(targetPageId) {
        // 隐藏所有页面
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // 更新导航链接状态
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // 激活当前导航链接
        const activeLink = document.querySelector(`[data-page="${targetPageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // 移动端：关闭菜单
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }

        // 滚动到顶部
        if (targetPageId === 'home') {
            // 首页强制滚动到顶部
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            // 延迟再次确保滚动到顶部
            setTimeout(() => {
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 50);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // 更新URL哈希（可选）
            history.pushState(null, null, `#${targetPage}`);
        });
    });

    // 移动端菜单切换
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // 点击菜单外部关闭菜单
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // 窗口大小改变时处理菜单状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // 处理浏览器前进后退按钮
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        } else {
            showPage('home');
        }
    });

    // 页面加载时检查URL哈希
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showPage(initialHash);
    }
    
    // 确保首页加载时滚动到顶部
    window.addEventListener('load', function() {
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 100);
    });
    
    // 页面加载完成后立即滚动到顶部
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动时隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动时显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;

        // 添加滚动时的背景透明度变化
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(247, 247, 247, 0.98)';
        } else {
            navbar.style.background = 'rgba(247, 247, 247, 0.95)';
        }
    });

    // 解决方案页面交互
    initSolutionsInteraction();
    
    // 路线图页面交互
    initRoadmapInteraction();
    
    // 产品画廊交互
    initProductGallery();
    
    // 关于我们页面交互
    initAboutPageInteraction();
});

// 解决方案页面交互功能
function initSolutionsInteraction() {
    const problemCards = document.querySelectorAll('.problem-card');
    const solutionContents = document.querySelectorAll('.solution-content');

    if (problemCards.length === 0 || solutionContents.length === 0) {
        return; // 如果元素不存在，直接返回
    }

    // 为每个痛点卡片添加点击事件
    problemCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const solutionId = this.getAttribute('data-solution');
            switchToSolution(solutionId, this);
        });
    });

    // 切换到指定解决方案
    function switchToSolution(solutionId, activeCard) {
        // 更新痛点卡片状态 - 实现折叠效果
        problemCards.forEach(card => {
            if (card === activeCard) {
                card.classList.remove('collapsed');
                card.classList.add('active');
            } else {
                card.classList.remove('active');
                card.classList.add('collapsed');
            }
        });

        // 更新解决方案显示
        solutionContents.forEach(content => {
            if (content.getAttribute('data-solution') === solutionId) {
                // 先隐藏当前显示的内容
                const currentActive = document.querySelector('.solution-content.active');
                if (currentActive && currentActive !== content) {
                    currentActive.style.opacity = '0';
                    currentActive.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        currentActive.classList.remove('active');
                        currentActive.style.display = 'none';
                        
                        // 显示新内容
                        content.style.display = 'block';
                        content.classList.add('active');
                        
                        // 触发动画
                        setTimeout(() => {
                            content.style.opacity = '1';
                            content.style.transform = 'translateY(0)';
                        }, 50);
                    }, 300);
                } else if (!currentActive) {
                    // 如果没有当前激活的内容，直接显示
                    content.style.display = 'block';
                    content.classList.add('active');
                    setTimeout(() => {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }, 50);
                }
            }
        });
    }

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('#solutions.page.active')) {
            const currentActive = document.querySelector('.problem-card.active');
            let nextIndex = -1;
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const currentIndex = Array.from(problemCards).indexOf(currentActive);
                nextIndex = currentIndex < problemCards.length - 1 ? currentIndex + 1 : 0;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = Array.from(problemCards).indexOf(currentActive);
                nextIndex = currentIndex > 0 ? currentIndex - 1 : problemCards.length - 1;
            }
            
            if (nextIndex >= 0) {
                const nextCard = problemCards[nextIndex];
                const solutionId = nextCard.getAttribute('data-solution');
                switchToSolution(solutionId, nextCard);
            }
        }
    });
}

// 路线图页面交互功能
function initRoadmapInteraction() {
    const roadmapSteps = document.querySelectorAll('.roadmap-step');
    
    if (roadmapSteps.length === 0) {
        return; // 如果元素不存在，直接返回
    }

    // 为每个步骤添加点击事件
    roadmapSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            // 移除所有高亮状态
            roadmapSteps.forEach(s => s.classList.remove('step-highlighted'));
            
            // 添加当前步骤的高亮状态
            this.classList.add('step-highlighted');
            
            // 添加点击动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // 添加悬浮时的进度指示
        step.addEventListener('mouseenter', function() {
            // 为当前步骤及之前的步骤添加完成状态
            for (let i = 0; i <= index; i++) {
                roadmapSteps[i].classList.add('step-completed');
            }
        });

        step.addEventListener('mouseleave', function() {
            // 移除所有完成状态
            roadmapSteps.forEach(s => s.classList.remove('step-completed'));
        });
    });

    // 添加滚动触发动画（如果IntersectionObserver可用）
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当路线图进入视口时，触发步骤动画
                    roadmapSteps.forEach((step, index) => {
                        step.style.animationDelay = `${(index + 1) * 0.1}s`;
                        step.classList.add('animate-in');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        const roadmapContainer = document.querySelector('.roadmap-container');
        if (roadmapContainer) {
            observer.observe(roadmapContainer);
        }
    }

    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('#roadmap.page.active')) {
            const currentHighlighted = document.querySelector('.roadmap-step.step-highlighted');
            let nextIndex = -1;
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                if (currentHighlighted) {
                    const currentIndex = Array.from(roadmapSteps).indexOf(currentHighlighted);
                    nextIndex = currentIndex < roadmapSteps.length - 1 ? currentIndex + 1 : 0;
                } else {
                    nextIndex = 0;
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (currentHighlighted) {
                    const currentIndex = Array.from(roadmapSteps).indexOf(currentHighlighted);
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : roadmapSteps.length - 1;
                } else {
                    nextIndex = roadmapSteps.length - 1;
                }
            }
            
            if (nextIndex >= 0) {
                roadmapSteps.forEach(s => s.classList.remove('step-highlighted'));
                roadmapSteps[nextIndex].classList.add('step-highlighted');
                roadmapSteps[nextIndex].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
}

// 产品画廊交互功能
function initProductGallery() {
    const productBtns = document.querySelectorAll('.product-btn');
    const mainImage = document.getElementById('mainProductImage');
    const productTitle = document.getElementById('productTitle');
    const productDesc = document.getElementById('productDesc');
    
    if (productBtns.length === 0 || !mainImage) {
        return; // 如果元素不存在，直接返回
    }
    
    // 产品数据
    const products = [
        {
            image: 'product/prd1.jpg',
            title: '标准组件',
            desc: '高效能标准钙钛矿组件，适用于各类建筑幕墙'
        },
        {
            image: 'product/prd2.jpg',
            title: '炫彩组件',
            desc: '多彩化设计，兼顾美观与发电效能'
        },
        {
            image: 'product/prd3.jpg',
            title: 'BIPV透光系列',
            desc: '透光设计，满足室内采光需求同时发电'
        },
        {
            image: 'product/prd4.jpg',
            title: 'BIPV仿石材系列',
            desc: '仿石材外观，自然质感与绿色能源完美结合'
        }
    ];
    
    let currentIndex = 0;
    let isAnimating = false;
    
    // 快速切换到指定产品
    function switchToProduct(index) {
        if (isAnimating || index === currentIndex) return;
        
        isAnimating = true;
        
        // 确保索引在有效范围内
        if (index < 0) {
            index = products.length - 1;
        } else if (index >= products.length) {
            index = 0;
        }
        
        currentIndex = index;
        
        // 更新按钮状态
        productBtns.forEach((btn, i) => {
            if (i === currentIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 快速图片切换动画
        const imageContainer = mainImage.parentElement;
        imageContainer.style.transition = 'opacity 0.15s ease';
        imageContainer.style.opacity = '0.3';
        
        setTimeout(() => {
            // 更新图片和内容
            mainImage.src = products[currentIndex].image;
            mainImage.alt = products[currentIndex].title;
            productTitle.textContent = products[currentIndex].title;
            productDesc.textContent = products[currentIndex].desc;
            
            // 恢复显示
            imageContainer.style.opacity = '1';
            
            // 短暂缩放效果
            mainImage.style.transform = 'scale(0.98)';
            setTimeout(() => {
                mainImage.style.transform = 'scale(1)';
                isAnimating = false;
            }, 100);
        }, 150);
    }
    
    // 产品按钮点击事件
    productBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            switchToProduct(index);
        });
        
        // 键盘支持
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchToProduct(index);
            }
        });
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        // 只在产品运营页面激活时响应键盘事件
        if (document.querySelector('#operations.page.active')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                switchToProduct(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                switchToProduct(currentIndex + 1);
            } else if (e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                switchToProduct(parseInt(e.key) - 1);
            }
        }
    });
    
    // 自动轮播功能
    let autoPlayInterval;
    let isAutoPlaying = false;
    
    function startAutoPlay() {
        if (isAutoPlaying) return;
        
        isAutoPlaying = true;
        autoPlayInterval = setInterval(() => {
            switchToProduct(currentIndex + 1);
        }, 3000); // 3秒切换一次，更快的节奏
    }
    
    function stopAutoPlay() {
        if (!isAutoPlaying) return;
        
        isAutoPlaying = false;
        clearInterval(autoPlayInterval);
    }
    
    // 鼠标悬浮时暂停自动播放
    const gallery = document.querySelector('.product-gallery');
    if (gallery) {
        gallery.addEventListener('mouseenter', stopAutoPlay);
        gallery.addEventListener('mouseleave', () => {
            if (document.querySelector('#operations.page.active')) {
                startAutoPlay();
            }
        });
    }
    
    // 当切换到产品运营页面时开始自动播放
    const operationsNavLink = document.querySelector('[data-page="operations"]');
    if (operationsNavLink) {
        operationsNavLink.addEventListener('click', function() {
            setTimeout(() => {
                if (document.querySelector('#operations.page.active')) {
                    startAutoPlay();
                }
            }, 500);
        });
    }
    
    // 页面可见性API - 当页面不可见时暂停自动播放
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoPlay();
        } else if (document.querySelector('#operations.page.active')) {
            setTimeout(startAutoPlay, 500);
        }
    });
    
    // 触摸滑动支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (gallery) {
        gallery.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay(); // 触摸时停止自动播放
        }, { passive: true });
        
        gallery.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            
            // 触摸结束后重启自动播放
            if (document.querySelector('#operations.page.active')) {
                setTimeout(startAutoPlay, 2000);
            }
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // 最小滑动距离
        const diffX = touchStartX - touchEndX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // 向左滑动 - 下一个
                switchToProduct(currentIndex + 1);
            } else {
                // 向右滑动 - 上一个
                switchToProduct(currentIndex - 1);
            }
        }
    }
    
    // IntersectionObserver - 当画廊进入视口时触发动画
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 启动按钮动画
                    setTimeout(() => {
                        productBtns.forEach((btn, index) => {
                            btn.style.animationDelay = `${index * 0.1}s`;
                            btn.classList.add('animate-in');
                        });
                        
                        // 启动自动播放
                        if (document.querySelector('#operations.page.active')) {
                            setTimeout(startAutoPlay, 1000);
                        }
                    }, 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });
        
        if (gallery) {
            observer.observe(gallery);
        }
    }
}

// 关于我们页面交互功能
function initAboutPageInteraction() {
    const constructionItems = document.querySelectorAll('.construction-item');
    
    if (constructionItems.length === 0) {
        return; // 如果元素不存在，直接返回
    }
    
    // 为每个在建项目添加点击事件
    constructionItems.forEach((item, index) => {
        const header = item.querySelector('.construction-header');
        const content = item.querySelector('.construction-content');
        const toggle = item.querySelector('.construction-toggle');
        
        if (!header || !content || !toggle) return;
        
        header.addEventListener('click', function() {
            // 检查当前项目是否已经展开
            const isActive = item.classList.contains('active');
            
            if (isActive) {
                // 如果已经展开，则折叠
                collapseItem(item);
            } else {
                // 如果未展开，则先折叠其他项目，再展开当前项目
                constructionItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        collapseItem(otherItem);
                    }
                });
                
                // 立即展开当前项目，CSS动画会处理时序
                expandItem(item);
            }
        });
        
        // 添加键盘支持
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
        
        // 设置header为可聚焦元素
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    });
    
    // 折叠项目函数
    function collapseItem(item) {
        const header = item.querySelector('.construction-header');
        
        if (!header) return;
        
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
    }
    
    // 展开项目函数
    function expandItem(item) {
        const header = item.querySelector('.construction-header');
        
        if (!header) return;
        
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
    }
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('#about.page.active')) {
            const headers = document.querySelectorAll('.construction-header');
            const currentFocused = document.activeElement;
            const currentIndex = Array.from(headers).indexOf(currentFocused);
            
            let nextIndex = -1;
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                nextIndex = currentIndex < headers.length - 1 ? currentIndex + 1 : 0;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                nextIndex = currentIndex > 0 ? currentIndex - 1 : headers.length - 1;
            }
            
            if (nextIndex >= 0) {
                headers[nextIndex].focus();
            }
        }
    });
    
    // 确保第一个项目默认展开
    if (constructionItems.length > 0) {
        const firstItem = constructionItems[0];
        if (!firstItem.classList.contains('active')) {
            expandItem(firstItem);
        }
    }
    
    // IntersectionObserver - 当在建基地区域进入视口时触发入场动画
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 为每个项目添加延迟入场动画
                    constructionItems.forEach((item, index) => {
                        item.style.animationDelay = `${index * 0.1}s`;
                        item.classList.add('animate-in');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        const constructionSection = document.querySelector('.construction-bases-section');
        if (constructionSection) {
            observer.observe(constructionSection);
        }
    }
}
