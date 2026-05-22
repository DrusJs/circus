document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.review-swiper').forEach(container => {
        const slidesContainer = container.querySelector('.swiper-content');
        const slides = Array.from(container.querySelectorAll('.swiper-item'));
        const prevBtn = container.querySelector('.left-button');
        const nextBtn = container.querySelector('.right-button');
        const paginationContainer = container.querySelector('.swiper-pagination');
        
        let currentIndex = 0;
        let slideWidth = 0;
        let isTransitioning = false;
        let wrapper = null;
        
        function createWrapper() {
            wrapper = container.querySelector('.swiper-wrapper');
            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.className = 'swiper-wrapper';
                while (slidesContainer.firstChild) {
                    wrapper.appendChild(slidesContainer.firstChild);
                }
                slidesContainer.appendChild(wrapper);
            }
        }
        
        function createPagination() {
            paginationContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const paginationItem = document.createElement('div');
                paginationItem.className = 'swiper-pagination-item';
                if (index === currentIndex) {
                    paginationItem.classList.add('active');
                }
                paginationItem.addEventListener('click', () => goToSlide(index));
                paginationContainer.appendChild(paginationItem);
            });
        }
        
        function updateDimensions() {
            slideWidth = slidesContainer.clientWidth;
            slides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
            });
            updateSlidePosition();
        }
        
        function updateSlidePosition() {
            if (isTransitioning) return;
            const offset = -currentIndex * slideWidth;
            wrapper.style.transform = `translateX(${offset}px)`;
        }
        
        function goToSlide(index) {
            if (isTransitioning) return;
            if (index < 0) index = 0;
            if (index >= slides.length) index = slides.length - 1;
            if (index === currentIndex) return;
            
            isTransitioning = true;
            currentIndex = index;
            wrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updatePagination();
            
            setTimeout(() => {
                isTransitioning = false;
            }, 300);
        }
        
        function nextSlide() {
            if (currentIndex < slides.length - 1) {
                goToSlide(currentIndex + 1);
            }
        }
        
        function prevSlide() {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
        }
        
        function updatePagination() {
            const paginationItems = Array.from(paginationContainer.children);
            paginationItems.forEach((item, index) => {
                if (index === currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
        
        function addEventListeners() {
            if (prevBtn) {
                prevBtn.addEventListener('click', () => prevSlide());
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => nextSlide());
            }
            
            let touchStartX = 0;
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            container.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            });
        }
        
        createWrapper();
        createPagination();
        addEventListeners();
        updateDimensions();
        
        window.addEventListener('resize', () => updateDimensions());
    });
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


document.querySelectorAll('.faq-accordion').forEach(accordion => {
    const head = accordion.querySelector('.faq-accordion-head');
    const dropdown = accordion.querySelector('.faq-accordion-dropdown');
    
    head.addEventListener('click', () => {
        const isActive = accordion.classList.contains('active');
        
        document.querySelectorAll('.faq-accordion').forEach(otherAccordion => {
            if (otherAccordion !== accordion && otherAccordion.classList.contains('active')) {
                otherAccordion.classList.remove('active');
                otherAccordion.style.zIndex = 0;
            }
        });
        
        if (!isActive) {
            accordion.classList.add('active');
            accordion.style.zIndex = 3;
        } else {
            accordion.classList.remove('active');
            setTimeout(() => {            
                accordion.style.zIndex = 0;
            }, 450);
        }
    });
});