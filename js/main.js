/**
 * ============================================
 * MAIN JAVASCRIPT FILE
 * Photographer Landing Page
 * ============================================
 *
 * Содержит:
 * 1. Gallery Slider (Swiper.js) - основная галерея
 * 2. Stories Slider (Swiper.js) - Instagram-style слайдер
 * 3. FAQ Accordion - кастомный аккордеон
 * 4. Smooth Scroll - плавная прокрутка якорей
 * 5. Resize Handler - пересчет высоты FAQ при изменении размера окна
 *
 * КАК МОДИФИЦИРОВАТЬ: Смотрите комментарии "// [НАСТРОЙКА]" в коде
 */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // SWIPER.JS - Gallery Slider Initialization
    // ========================================
    // [НАСТРОЙКА] Изменить количество слайдов в breakpoints ниже

    const gallerySwiper = new Swiper('.gallerySwiper', {
        // Default: 1 slide on mobile
        slidesPerView: 1,
        spaceBetween: 20,

        // Responsive breakpoints (изменить здесь количество слайдов)
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 30 },  // Tablet: 2 слайда
            992: { slidesPerView: 3, spaceBetween: 30 },  // Desktop: 3 слайда
            1200: { slidesPerView: 3, spaceBetween: 40 }  // Large: 3 слайда
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },

        // Autoplay (optional)
        // autoplay: {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },

        // Loop
        loop: true,

        // Grab cursor
        grabCursor: true,

        // Keyboard control
        keyboard: {
            enabled: true,
        },

        // Accessibility
        a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
        }
    });


    // ========================================
    // SWIPER.JS - Stories Slider Initialization
    // ========================================
    // [НАСТРОЙКА] Изменить delay (время показа) и speed (скорость перехода) ниже

    let currentStoryIndex = 0;
    const progressBars = document.querySelectorAll('.story-progress-bar');

    const storiesSwiper = new Swiper('.storiesSwiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        effect: 'fade',           // Эффект перехода: 'fade', 'slide', 'cube', 'coverflow'
        fadeEffect: {
            crossFade: true         // Плавный crossfade между слайдами
        },

        // [НАСТРОЙКА] Изменить время показа каждого слайда (в миллисекундах)
        autoplay: {
            delay: 5000,            // 5 секунд на слайд (изменить здесь)
            disableOnInteraction: false,
        },

        loop: true,               // Бесконечная прокрутка

        // [НАСТРОЙКА] Скорость перехода (в миллисекундах)
        speed: 800,               // 0.8 секунды (изменить здесь)

        // Events
        on: {
            init: function () {
                updateProgressBars(0);
            },
            slideChange: function () {
                const realIndex = this.realIndex;
                updateProgressBars(realIndex);
            },
            autoplayTimeLeft: function (swiper, time, progress) {
                // Update current progress bar fill
                if (progressBars[currentStoryIndex]) {
                    const fillProgress = (1 - progress) * 100;
                    progressBars[currentStoryIndex].style.setProperty('--progress', fillProgress + '%');
                }
            }
        }
    });

    /**
     * Update progress bars based on current slide
     * @param {number} index - Current slide index
     */
    function updateProgressBars(index) {
        currentStoryIndex = index;

        progressBars.forEach((bar, i) => {
            bar.classList.remove('active', 'completed');

            if (i < index) {
                // Completed bars
                bar.classList.add('completed');
            } else if (i === index) {
                // Active bar
                bar.classList.add('active');
            }
            // Future bars remain empty
        });
    }

    // Кликабельные области для навигации stories (left/right)
    document.querySelector('.story-nav-prev')?.addEventListener('click', (e) => {
        e.preventDefault();
        storiesSwiper.slidePrev();
    });

    document.querySelector('.story-nav-next')?.addEventListener('click', (e) => {
        e.preventDefault();
        storiesSwiper.slideNext();
    });


    // ========================================
    // FAQ ACCORDION
    // ========================================
    // [НАСТРОЙКА] Позволяет открывать несколько вопросов одновременно
    // Чтобы открывать только один вопрос: смотрите COMPONENTS-GUIDE.md

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');

        // Initially hide all answers
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.4s ease';

        // Add click event listener
        question.addEventListener('click', function () {
            toggleFAQ(item, answer, icon);
        });

        // Add keyboard support (Enter and Space)
        question.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item, answer, icon);
            }
        });

        // Add ARIA attributes
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        answer.setAttribute('id', `faq-answer-${index}`);
    });

    /**
     * Toggle FAQ item open/close
     * @param {HTMLElement} item - FAQ item element
     * @param {HTMLElement} answer - Answer element
     * @param {HTMLElement} icon - Icon element (+ or −)
     */
    function toggleFAQ(item, answer, icon) {
        const isOpen = item.classList.contains('active');

        if (isOpen) {
            // Close the item
            item.classList.remove('active');
            answer.style.maxHeight = '0';
            icon.textContent = '+';
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        } else {
            // Open the item
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.textContent = '−';
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        }
    }


    // ========================================
    // SMOOTH SCROLL (Optional)
    // ========================================

    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ========================================
    // WINDOW RESIZE HANDLER (Optional)
    // ========================================

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            // Recalculate FAQ answer heights if open
            document.querySelectorAll('.faq-item.active .faq-answer').forEach(answer => {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            });
        }, 250);
    });

});
