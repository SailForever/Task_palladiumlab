$(document).ready(function () {

  // Проверка поддержки WebP и добавление соответствующего класса к <html>
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  testWebP(function (support) {
    if (support) {
      document.querySelector('html').classList.add('webp');
    } else {
      document.querySelector('html').classList.add('no-webp');
    }
  });

  // Плавный переход к якорям
  $("body").on("click", '[href*="#"]', function (e) {
    e.preventDefault();
    const target = $(this.hash);
    target.length && $("html, body").animate({ scrollTop: target.offset().top - 100 }, 800);
  });

  let tabButton = $(".tabs__btn");
  let originalTitle = $(".hero h1").attr("data-initialTitle");
  let resetStyleTimeout;

  // Наведение на табы на больших экранах
  if ($(window).width() > 1000) {
    tabButton.on("mouseenter", function () {
      clearTimeout(resetStyleTimeout);
      let parentTab = $(this).closest(".tabs__item");
      let newTitle = parentTab.attr("data-title");
      let backgroundImg = parentTab.attr("data-bg");

      if ($("html").hasClass("webp")) {
        backgroundImg = backgroundImg.replace(/\.[^/.]+$/, ".webp");
      }

      parentTab.addClass("active").siblings().removeClass("active");
      $(".hero h1 strong").text(newTitle);
      $(".hero").addClass("active").find(".hero__bg").css("background-image", `url(${backgroundImg})`);
      $(".header").addClass("white");
    });

    tabButton.on("mouseleave", function () {
      let parentTab = $(this).closest(".tabs__item");
      parentTab.removeClass("active");
      $(".hero").removeClass("active");

      resetStyleTimeout = setTimeout(() => {
        $(".hero .hero__bg").css("background-image", "");
      }, 400);

      $(".hero h1 strong").html(originalTitle);
      $(".header").removeClass("white");
    });
  } else {
    // на маленькие экраны
    tabButton.on("click", function () {
      let parentTab = $(this).closest(".tabs__item");
      let newTitle = parentTab.attr("data-title");
      let backgroundImg = parentTab.attr("data-bg");

      if ($("html").hasClass("webp")) {
        backgroundImg = backgroundImg.replace(/\.[^/.]+$/, ".webp");
      }

      parentTab.toggleClass("active").siblings().removeClass("active");
      $(".hero h1 strong").text(newTitle);
      $(".hero__bottom").css("background-image", `url(${backgroundImg})`);

      if ($(".hero").hasClass("active")) {
        $(".header").addClass("white");
      } else {
        $(".header").removeClass("white");
      }

      if (!$(".tabs__item.active").length) {
        $(".hero").removeClass("active");
        $(".header").removeClass("white");
        $(".hero h1 strong").html(originalTitle);
        $(".hero__bottom").css("background-image", "");
      }
    });
  }

  // Переключение прокрутки у body при открытии меню
  $(".burger").on("click", function () {
    $(this).toggleClass("active");
    $(".mobile-menu").toggleClass("show");
    $("body").toggleClass("overflow");
  });
  $(".mobile-menu a").on("click", function () {
    $(".burger").toggleClass("active");
    $(".mobile-menu").toggleClass("show");
    $("body").toggleClass("overflow");
  });

  // валидация
  const inputs = document.querySelectorAll('.input-item');

  const form = document.getElementById('feedback-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateForm()) {
      $('#tel').unmask();
      $('#tel').attr('placeholder', '');
      inputs.forEach(input => {
        input.classList.remove('focus');
      });
      event.target.reset();
    }
  })

  const phoneMask = '+7 (000) 000-00-00';

  // при потере фокуса показываем ошибку, если значение пустое или неправильное
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      input.classList.add('focus');
    });
  });
  inputs.forEach(input => {
    input.addEventListener('blur', function () {
      if (!input.value) {
        input.classList.add('no-val');
        input.classList.remove('focus');
        showError(input);
      }
      else {
        input.classList.remove('no-val');
        clearError(input);
      }
    });
  });

  function validateForm() {
    let isValid = true
    inputs.forEach(input => {
      if (!input.value) {
        showError(input);
        isValid = false;
      } else if (input.name === 'tel' && !validatePhone()) {
        showError(input);
        isValid = false;
      }
      else {
        clearError(input);
      }
    })
    return isValid;
  }

  function validatePhone() {
    let isValid = true
    const phoneValue = $('#tel').val();
    const isComplete = phoneValue.length === phoneMask.length;
    if (phoneValue === '') {
      $('#tel').unmask();
      $('#tel').attr('placeholder', '');
    } else if (!isComplete) {
      showError($('#tel').get(0));
      isValid = false;
    } else {
      clearError($('#tel').get(0));
    }
    return isValid;
  }
  $('#tel').on('focus', function () {
    $(this).mask(phoneMask);
    $(this).attr('placeholder', phoneMask);
  });
  $('#tel').on('blur', function () {
    const phoneValue = $(this).val();
    const isComplete = phoneValue.length === phoneMask.length;
    if (phoneValue === '') {
      $(this).unmask();
      $(this).attr('placeholder', '');
    } else if (!isComplete) {
      showError($(this).get(0));
    } else {
      clearError($(this).get(0));
    }
  });

  function showError(input) {
    input.classList.add('error');
  }

  function clearError(input) {
    input.classList.remove('error');
  };

});
