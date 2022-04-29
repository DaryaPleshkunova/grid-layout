(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // Открытие/закрытие адреса поверх карты

    const addressCloseBtn = document.getElementById('address__close-btn');
    const addressOpenBtn = document.getElementById('address__open-btn');
    const addressText = document.getElementById('address__content');


    addressCloseBtn.addEventListener('click', () => {
      addressText.classList.add('address__content_closed')
      window.setTimeout(() => {
        addressOpenBtn.classList.add('address__open-btn_visible')
      }, 500)
    })

    addressOpenBtn.addEventListener('click', () => {
      addressOpenBtn.classList.remove('address__open-btn_visible')
      window.setTimeout(() => {
        addressText.classList.remove('address__content_closed')
      }, 500)
    })

    // Поле поиска в хедере

    const searchBtn = document.getElementById('search-form__button');
    const searchInput = document.getElementById('search-form__input');

    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.classList.toggle('search-form__input_hidden');
    })

    // Скролл до якорей

    const anchors = document.querySelectorAll('a[href*="#"]')

    for (let anchor of anchors) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const blockID = anchor.getAttribute('href').substr(1)

        document.getElementById(blockID).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      })
    }

    // Открытие/закрытие бургера

    const headerBurger = document.getElementById('header__burger');
    const headerNav = document.getElementById('header__nav');

    headerBurger.addEventListener('click', () => {
      headerNav.classList.toggle('nav-list_visible');

      if (headerBurger.classList.contains('burger_to-close')) {
        headerBurger.classList.remove('burger_to-close')
        headerBurger.classList.add('burger_to-open');
      } else {
        headerBurger.classList.remove('burger_to-open');
        headerBurger.classList.add('burger_to-close');
      }
    })

    // Инициализация и параметры яндекс-карты

    ymaps.ready(init);
    function init(){
        var myMap = new ymaps.Map("map", {
          center: [55.7605,37.5964],
          zoom: 13,
          controls: ['geolocationControl']
        });

        myPlacemark = new ymaps.Placemark([55.77, 37.63], {
          hintContent: 'Фотостудия High pass',
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'images/png/placemark.png',
          iconImageSize: [12, 12],
        }),

      myMap.controls.remove('geolocationControl');
      myMap.geoObjects.add(myPlacemark);
    }

    // Валидация поля секции "О нас"
    new JustValidate('.about-section__form', {
      rules: {
        email: {
          required: true,
          email: true,
        }
      },

      messages: {
        email: 'Укажите ваш e-mail'
      },

      colorWrong: '#F06666'
    })

    // Валидация формы заявки
    new JustValidate('.apply-form', {
      rules: {
        name: {
          required: true,
          minLength: 2,
          function: (name, value) => {
            const allowedLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяabcdefghijklmnopqrstuvwxyz- ';
            const checkingString = Array.from(value.toLowerCase());
            for (let item of checkingString) {
              if (allowedLetters.includes(item) === false) {
                return false;
              }
            }
            return name
          }
        },

        email: {
          required: true,
          email: true,
        },

        text: {
          required: true,
          minLength: 5
        }
      },

      messages: {
        name: {
          minLength: 'Имя должно содержать не менее 2 символов',
          required: 'Как вас зовут?',
          function: 'Недопустимый формат',
        },

        email: 'Укажите ваш e-mail',

        text: {
          minLength: 'Поле должно содержать не менее 5 символов',
          required: 'Укажите данные заказа'
        }
      },

      colorWrong: '#FF3030'
    })
  })
})()
