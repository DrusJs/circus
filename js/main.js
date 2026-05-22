class ReviewSlider {
    constructor(container) {
        this.container = container;
        this.slidesContainer = container.querySelector('.swiper-content');
        this.slides = Array.from(container.querySelectorAll('.swiper-item'));
        this.prevBtn = container.querySelector('.left-button');
        this.nextBtn = container.querySelector('.right-button');
        this.paginationContainer = container.querySelector('.swiper-pagination');
        
        this.currentIndex = 0;
        this.slideWidth = 0;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Создаем обертку для слайдов
        this.createWrapper();
        // Создаем пагинацию
        this.createPagination();
        // Добавляем обработчики событий
        this.addEventListeners();
        // Обновляем размеры
        this.updateDimensions();
        
        // Обновляем размеры при изменении окна
        window.addEventListener('resize', () => this.updateDimensions());
    }
    
    createWrapper() {
        // Создаем wrapper если его нет
        let wrapper = this.container.querySelector('.swiper-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'swiper-wrapper';
            
            // Перемещаем все слайды в wrapper
            while (this.slidesContainer.firstChild) {
                wrapper.appendChild(this.slidesContainer.firstChild);
            }
            this.slidesContainer.appendChild(wrapper);
        }
        this.wrapper = wrapper;
        this.slides = Array.from(this.wrapper.children);
    }
    
    createPagination() {
        // Очищаем контейнер пагинации
        this.paginationContainer.innerHTML = '';
        
        // Создаем кружки для каждого слайда
        this.slides.forEach((_, index) => {
            const paginationItem = document.createElement('div');
            paginationItem.className = 'swiper-pagination-item';
            if (index === this.currentIndex) {
                paginationItem.classList.add('active');
            }
            paginationItem.addEventListener('click', () => this.goToSlide(index));
            this.paginationContainer.appendChild(paginationItem);
        });
        
        this.paginationItems = Array.from(this.paginationContainer.children);
    }
    
    updateDimensions() {
        // Получаем ширину контейнера
        this.slideWidth = this.slidesContainer.clientWidth;
        
        // Устанавливаем ширину для каждого слайда
        this.slides.forEach(slide => {
            slide.style.width = `${this.slideWidth}px`;
        });
        
        // Обновляем позицию слайда
        this.updateSlidePosition();
    }
    
    updateSlidePosition() {
        if (this.isTransitioning) return;
        const offset = -this.currentIndex * this.slideWidth;
        this.wrapper.style.transform = `translateX(${offset}px)`;
    }
    
    goToSlide(index) {
        if (this.isTransitioning) return;
        if (index < 0) index = 0;
        if (index >= this.slides.length) index = this.slides.length - 1;
        if (index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        
        // Анимируем переход
        this.wrapper.style.transform = `translateX(-${this.currentIndex * this.slideWidth}px)`;
        
        // Обновляем активный класс в пагинации
        this.updatePagination();
        
        // Завершаем переход
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }
    
    nextSlide() {
        if (this.currentIndex < this.slides.length - 1) {
            this.goToSlide(this.currentIndex + 1);
        } else if (this.currentIndex === this.slides.length - 1) {
            // Опционально: зацикливание
            // this.goToSlide(0);
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        } else if (this.currentIndex === 0) {
            // Опционально: зацикливание
            // this.goToSlide(this.slides.length - 1);
        }
    }
    
    updatePagination() {
        this.paginationItems.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    addEventListeners() {
        // Кнопки навигации
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Touch события для мобильных устройств
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const threshold = 50; // минимальное расстояние для свайпа
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide(); // свайп влево
            } else {
                this.prevSlide(); // свайп вправо
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.review-swiper');
    sliders.forEach(slider => new ReviewSlider(slider));
});

let phoneInputs = document.querySelectorAll('input[data-tel-input]');

function getInputNumbersValue(input) {
    return input.value.replace(/\D/g, '');
}

function onPhonePaste(e) {
    let input = e.target,
        inputNumbersValue = getInputNumbersValue(input);
    let pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
        let pastedText = pasted.getData('Text');
        if (/\D/g.test(pastedText)) {
            input.value = inputNumbersValue;
            return;
        }
    }
}

function onPhoneInput(e) {
    let input = e.target,
        inputNumbersValue = getInputNumbersValue(input),
        selectionStart = input.selectionStart,
        formattedInputValue = "";

    if (!inputNumbersValue) {
        return input.value = "";
    }

    if (input.value.length != selectionStart) {
        if (e.data && /\D/g.test(e.data)) {
            input.value = inputNumbersValue;
        }
        return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
        if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
        let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
        formattedInputValue = input.value = firstSymbols + " ";
        if (inputNumbersValue.length > 1) {
            formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
            formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
            formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
            formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
        }
    } else {
        formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
    }
    input.value = formattedInputValue;
}

function onPhoneKeyDown(e) {
    let inputValue = e.target.value.replace(/\D/g, '');
    if (e.keyCode == 8 && inputValue.length == 1) {
        e.target.value = "";
    }
}

for (let phoneInput of phoneInputs) {
    phoneInput.addEventListener('keydown', onPhoneKeyDown);
    phoneInput.addEventListener('input', onPhoneInput, false);
    phoneInput.addEventListener('paste', onPhonePaste, false);
}