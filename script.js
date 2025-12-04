// 性能优化工具函数
function raf(fn) {
    return window.requestAnimationFrame ? requestAnimationFrame(fn) : setTimeout(fn, 16);
}

// 节流函数 - 限制函数调用频率
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 防抖函数 - 延迟函数执行直到用户停止操作
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 等待DOM加载完成
 document.addEventListener('DOMContentLoaded', function() {
    // 导航栏功能实现
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端菜单切换
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // 切换按钮图标状态
            const icon = this.querySelector('span');
            if (icon) {
                icon.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
            }
        });
    }
    
    // 窗口大小变化事件处理
    window.addEventListener('resize', throttle(function() {
        // 在大屏幕上自动关闭移动菜单
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn?.querySelector('span');
            if (icon) {
                icon.textContent = '☰';
            }
        }
        

    }, 100));
    
    // 导航栏滚动监听功能
    function updateActiveNavItem() {
        const scrollPosition = window.scrollY + 100; // 添加偏移量以提前激活
        let currentSectionId = null;
        
        // 获取所有导航链接对应的目标区域，找出当前可见的区域
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const targetId = href.slice(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const sectionTop = targetSection.offsetTop;
                    const sectionBottom = sectionTop + targetSection.offsetHeight;
                    
                    // 如果滚动位置在当前区域内，记录该区域ID
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSectionId = targetId;
                    }
                }
            }
        });
        
        // 更新所有链接的活动状态
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const targetId = href.slice(1);
                
                // 如果链接指向当前可见区域，则设为活动状态
                if (targetId === currentSectionId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    
    // 初始化活动导航项
    updateActiveNavItem();
    
    // 滚动时更新活动导航项
    window.addEventListener('scroll', throttle(updateActiveNavItem, 100));
    

    
    // 点击导航链接时的处理
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 如果是锚点链接
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // 关闭移动菜单
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuBtn?.querySelector('span');
                    if (icon) {
                        icon.textContent = '☰';
                    }
                }
                
                const targetId = href.slice(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // 平滑滚动到目标位置
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // 考虑导航栏高度
                        behavior: 'smooth'
                    });
                    
                    // 手动设置活动状态
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 如果点击的是下拉菜单中的链接，也设置父级链接为活动状态
                    if (this.classList.contains('dropdown-link')) {
                        const parentLink = this.closest('.dropdown').querySelector('.dropdown-toggle');
                        if (parentLink) {
                            parentLink.classList.add('active');
                        }
                    }
                }
            }
        });
    });
    
    // 滚动处理初始化
    const backToTop = document.getElementById('back-to-top');
    
    // 创建并添加回到顶部按钮
    if (!backToTop) {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        backToTopBtn.setAttribute('aria-label', '返回顶部');
        backToTopBtn.setAttribute('title', '返回顶部');
        backToTopBtn.style.position = 'fixed';
        backToTopBtn.style.bottom = '20px';
        backToTopBtn.style.right = '20px';
        backToTopBtn.style.width = '48px';
        backToTopBtn.style.height = '48px';
        backToTopBtn.style.borderRadius = '50%';
        backToTopBtn.style.backgroundColor = '#1a56db';
        backToTopBtn.style.color = 'white';
        backToTopBtn.style.border = 'none';
        backToTopBtn.style.cursor = 'pointer';
        backToTopBtn.style.display = 'none';
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transition = 'all 0.3s ease';
        backToTopBtn.style.zIndex = '1000';
        document.body.appendChild(backToTopBtn);
    }
    
    // 处理滚动事件
    window.addEventListener('scroll', throttle(function() {
        const scrollPosition = window.scrollY;
        
        // 显示/隐藏回到顶部按钮
        const backToTopEl = document.getElementById('back-to-top');
        if (backToTopEl) {
            if (scrollPosition > 300) {
                backToTopEl.style.display = 'flex';
                setTimeout(() => {
                    backToTopEl.style.opacity = '1';
                }, 10);
            } else {
                backToTopEl.style.opacity = '0';
                setTimeout(() => {
                    backToTopEl.style.display = 'none';
                }, 300);
            }
        }
    }, 100));
    
    // 回到顶部功能 - 增强版本
    document.getElementById('back-to-top')?.addEventListener('click', function() {
        // 添加点击动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // 平滑滚动
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 表单提交处理 - 增强可访问性和错误处理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        // 添加状态提示区域
        const formStatus = document.createElement('div');
        formStatus.className = 'form-status';
        formStatus.setAttribute('role', 'alert');
        formStatus.setAttribute('aria-live', 'polite');
        contactForm.parentNode.insertBefore(formStatus, contactForm.nextSibling);
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 清除之前的错误提示
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            
            // 获取表单数据
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // 增强的表单验证和错误提示
            function showError(element, message) {
                isValid = false;
                element.classList.add('error');
                element.setAttribute('aria-invalid', 'true');
                element.setAttribute('aria-describedby', element.id + '-error');
                
                // 创建或更新错误消息元素
                let errorMsg = document.getElementById(element.id + '-error');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.id = element.id + '-error';
                    errorMsg.className = 'error-message';
                    errorMsg.setAttribute('role', 'alert');
                    errorMsg.setAttribute('aria-live', 'assertive');
                    element.parentNode.insertBefore(errorMsg, element.nextSibling);
                }
                errorMsg.textContent = message;
            }
            
            // 清除错误状态
            function clearError(element) {
                element.classList.remove('error');
                element.setAttribute('aria-invalid', 'false');
                element.removeAttribute('aria-describedby');
                const errorMsg = document.getElementById(element.id + '-error');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
            
            // 验证每个字段
            if (!nameInput.value.trim()) {
                showError(nameInput, '请输入您的姓名');
            } else {
                clearError(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                showError(emailInput, '请输入您的邮箱');
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, '请输入有效的电子邮箱地址');
            } else {
                clearError(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                showError(messageInput, '请输入留言内容');
            } else {
                clearError(messageInput);
            }
            
            if (isValid) {
                // 模拟表单提交 - 使用setTimeout模拟异步操作
                raf(() => {
                    formStatus.textContent = '正在提交，请稍候...';
                    formStatus.classList.add('submitting');
                });
                
                // 模拟AJAX请求延迟
                setTimeout(() => {
                    raf(() => {
                        formStatus.textContent = '感谢您的留言！我们会尽快回复您。';
                        formStatus.classList.remove('submitting');
                        formStatus.classList.add('success');
                        contactForm.reset();
                        
                        // 5秒后清除成功消息
                        setTimeout(() => {
                            formStatus.textContent = '';
                            formStatus.className = 'form-status';
                        }, 5000);
                    });
                }, 1500);
            } else {
                // 滚动到第一个错误字段
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
        
        // 添加输入时的实时验证
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    this.setAttribute('aria-invalid', 'false');
                    this.removeAttribute('aria-describedby');
                    const errorMsg = document.getElementById(this.id + '-error');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            // 增强可访问性 - 添加键盘导航支持
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && this.tagName.toLowerCase() !== 'textarea') {
                    e.preventDefault();
                    const inputs = Array.from(contactForm.querySelectorAll('input, textarea'));
                    const currentIndex = inputs.indexOf(this);
                    const nextIndex = (currentIndex + 1) % inputs.length;
                    inputs[nextIndex].focus();
                }
            });
        });
    }
    
    // 邮箱验证函数
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // 优化的图片懒加载 - 使用IntersectionObserver API
    const lazyLoadImages = function() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 性能优化：避免不必要的DOM操作
                    if (img.dataset.src && img.src !== img.dataset.src) {
                        // 使用requestAnimationFrame包装图片加载
                        raf(() => {
                            // 预加载图片
                            const newImg = new Image();
                            newImg.src = img.dataset.src;
                            
                            newImg.onload = function() {
                                // 图片加载完成后更新DOM
                                raf(() => {
                                    img.src = img.dataset.src;
                                    img.classList.add('loaded');
                                    img.removeAttribute('data-src');
                                    
                                    // 性能优化：图片加载完成后停止观察
                                    observer.unobserve(img);
                                });
                            };
                            
                            newImg.onerror = function() {
                                // 错误处理：加载失败时使用占位图或显示错误状态
                                raf(() => {
                                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="12"%3E图片加载失败%3C/text%3E%3C/svg%3E';
                                    img.classList.add('error');
                                    observer.unobserve(img);
                                });
                            };
                        });
                    } else {
                        // 对于没有data-src的图片，直接设置为完全不透明
                        raf(() => {
                            img.style.opacity = '1';
                        });
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '0px 0px 300px 0px', // 提前300px加载
            threshold: 0.01
        });
        
        // 获取所有需要懒加载的图片
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 设置初始样式
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            // 开始观察
            imageObserver.observe(img);
        });
    };
    
    // 检查浏览器是否支持IntersectionObserver API
    if ('IntersectionObserver' in window) {
        // 延迟初始化，避免阻塞主线程
        setTimeout(() => {
            lazyLoadImages();
        }, 100);
    } else {
        // 降级处理：立即加载所有图片
        const images = document.querySelectorAll('img[data-src], img.lazy-load');
        images.forEach(function(img) {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.style.opacity = '1';
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 移动端点击菜单链接后关闭菜单
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.style.display = 'none';
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 减去导航栏高度，确保内容不被遮挡
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 添加卡片动画效果
    const animateCards = function() {
        const cardObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    observer.unobserve(card);
                }
            });
        });
        
        // 为活动卡片和资源项添加动画
        const cards = document.querySelectorAll('.activity-card, .resource-item, .goal-item');
        cards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    };
    
    if ('IntersectionObserver' in window) {
        // 延迟初始化，避免阻塞主线程
        setTimeout(() => {
            animateCards();
        }, 100);
    } else {
        // 降级处理：立即显示所有卡片
        const cards = document.querySelectorAll('.activity-card, .resource-item, .goal-item');
        cards.forEach(function(card) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }
    
    // 添加页面加载动画
    window.addEventListener('load', function() {
        // 可以在这里添加页面加载完成后的动画效果
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    });
    
    // 初始化页面
    document.body.style.opacity = '1';
    
    // 为按钮添加悬浮效果增强
const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// 微信公众号弹窗功能
const showWechatModal = document.getElementById('showWechatModal');
const wechatModal = document.getElementById('wechatModal');
const closeModal = document.getElementById('closeModal');

// 点击"班级微信公众号"按钮显示弹窗
if (showWechatModal && wechatModal) {
    showWechatModal.addEventListener('click', function(event) {
        event.preventDefault();
        wechatModal.style.display = 'flex';
        // 阻止背景滚动
        document.body.style.overflow = 'hidden';
    });
}

// 点击关闭按钮关闭弹窗
if (closeModal && wechatModal) {
    closeModal.addEventListener('click', function() {
        wechatModal.style.display = 'none';
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
    });
}

// 点击弹窗外部关闭弹窗
if (wechatModal) {
    wechatModal.addEventListener('click', function(event) {
        if (event.target === wechatModal) {
            wechatModal.style.display = 'none';
            // 恢复背景滚动
            document.body.style.overflow = 'auto';
        }
    });
}

// 按ESC键关闭弹窗
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && wechatModal && wechatModal.style.display === 'flex') {
        wechatModal.style.display = 'none';
        // 恢复背景滚动
        document.body.style.overflow = 'auto';
    }
});

// 自动尝试加载二维码图片
function loadQRCode() {
    const qrCodeImg = document.getElementById('wechatQRCode');
    const placeholder = document.getElementById('qrcodePlaceholder');
    
    if (qrCodeImg && placeholder) {
        // 尝试加载二维码图片
        qrCodeImg.onload = function() {
            // 图片加载成功，显示图片，隐藏占位符
          qrCodeImg.style.display = 'block';
            placeholder.style.display = 'none';
        };
        
        qrCodeImg.onerror = function() {
            // 图片加载失败，显示占位符，隐藏图片
            qrCodeImg.style.display = 'none';
            placeholder.style.display = 'block';
        };
        
        // 触发图片加载
        qrCodeImg.src = 'qrcode/qrcode.jpg';
    }
    
    // 加载底部二维码图片
    const footerQRCodeImg = document.getElementById('footerWechatQRCode');
    const footerPlaceholder = document.getElementById('footerQRCodePlaceholder');
    
    if (footerQRCodeImg && footerPlaceholder) {
        // 尝试加载图片
        footerQRCodeImg.onload = function() {
            // 图片加载成功，显示图片，隐藏占位符
          footerQRCodeImg.style.display = 'block';
            footerPlaceholder.style.display = 'none';
        };
        
        footerQRCodeImg.onerror = function() {
            // 图片加载失败，隐藏图片，显示占位符
            footerQRCodeImg.style.display = 'none';
            footerPlaceholder.style.display = 'block';
        };
        
        // 触发图片加载
        footerQRCodeImg.src = 'qrcode/qrcode.jpg';
    }
}

// 在弹窗打开时尝试加载二维码图片
if (showWechatModal && wechatModal) {
    showWechatModal.addEventListener('click', function() {
        loadQRCode();
    });
}

// 页面加载完成后也尝试一次加载二维码图片
setTimeout(loadQRCode, 1000);
});