$(function () {
  var $window = $(window);
  var $previewArea = $('.preview-area');
  var $controlBar = $('.control-bar', $previewArea);
  var $sliderGroup = $('.slider.group', $controlBar);
  var $othersGroup = $('.others.group', $controlBar);
  var $textarea = $('textarea', $previewArea);
  var defaultText = {
    en: 'We make products with technologies based on open source. We believe that as we use open source technology, we should contribute more to the ecosystem. The more these contributions are made, the healthier the open source community will be and more users will step forward together.',
    kr: '스포카 서비스의 많은 부분은 오픈소스 기술로 이루어져 있습니다. 스포카는 오픈소스 기술을 이용하는 만큼 그 생태계에 기여합니다. 이러한 기여가 모일수록 오픈소스 커뮤니티가 건강해지며, 사용자도 함께 성장해 나갈 것입니다.',
    jp: 'Spoqaサービスの多くのところはオープンソースの技術で構成されております。Spoqaは、オープンソース技術を利用するだけに、その生態系に貢献します。このような貢献が集まるほどコミュニティは健全となり、ユーザーと共に成長することができます。'
  };
  { // property slider
    var $sliders = $('> .slider', $sliderGroup);
    $('> .font-size.slider', $sliderGroup).on('slider:update', function (e, value) {
      $textarea.css('font-size', value + 'px');
    });
    $('> .line-height.slider', $sliderGroup).on('slider:update', function (e, value) {
      $textarea.css('line-height', value);
    });
    $('> .letter-spacing.slider', $sliderGroup).on('slider:update', function (e, value) {
      $textarea.css('letter-spacing', value + 'em');
    });
    $sliders.each(function (i, el) {
      var $slider = $(el);
      var $range = $('> .range', $slider);
      var $handle = $('> .handle', $range);
      var min = +$slider.data('min');
      var max = +$slider.data('max');
      { // init
        var val = +$slider.data('val');
        setHandlePos((val - min) / (max - min));
      }
      function lerp(a, b, t) {
        return (b - a) * t + a;
      }
      function getPageX(e) {
        if (e.type[0] === 't') { // touchstart, touchmove, touchend
          return e.originalEvent.touches[0].pageX;
        } else { // mousedown, mousemove, mouseup
          return e.pageX;
        }
      }
      function getT(pageX) {
        var handleWidth = $handle.width();
        var rangeWidth = $range.width();
        var rangeOffset = $range.offset().left;
        var t = (pageX - rangeOffset - (handleWidth / 2)) / (rangeWidth - handleWidth);
        return (t > 1) ? 1 : (t < 0) ? 0 : t; // return clamped t
      }
      function setHandlePos(t) { // t: 0 ~ 1
        var handleWidth = $handle.width();
        var p = (t * 100) | 0; // percent
        var h = (handleWidth * t) | 0;
        $handle.css('left', 'calc(' + p + '% - ' + h + 'px)');
        $range.data('t', t);
        $slider.trigger('slider:update', [lerp(min, max, t)]);
      }
      function setHandlePosByEvent(e) {
        var pageX = getPageX(e);
        var t = getT(pageX);
        setHandlePos(t);
      }
      $window.on('resize', function (e) {
        setHandlePos(+$range.data('t'));
      });
      $range.on('mousedown touchstart', function (e) {
        setHandlePosByEvent(e);
        function onMove(e) {
          setHandlePosByEvent(e);
        }
        $window.on('mousemove touchmove', onMove);
        $window.one('mouseup touchend touchcancel', function (e) {
          $window.off('mousemove touchmove', onMove);
        });
      });
    });
  }
  { // theme control
    var $option = $('> .theme.control > .option', $othersGroup);
    $option.on('click', function () {
      var $this = $(this);
      $option.removeClass('selected');
      $this.addClass('selected');
      if ($this.hasClass('light')) {
        $previewArea.addClass('light');
      } else {
        $previewArea.removeClass('light');
      }
    });
  }
  { // family select
    var $select = $('> .font-family.control > select', $othersGroup);
    var lastWeight = '';
    function updateFontFamily() {
      var value = $select.val();
      var text = $textarea.val();
      if (lastWeight !== value) {
          lastWeight = value;
          text = defaultText['kr'];
      }

      $textarea.val(text);

      var weight = {
        'thin': 100,
        'light': 300,
        'regular': 400,
        'medium': 500,
        'bold': 700,
      }

      $textarea.removeClass();
      $textarea.css('font-weight', weight[value]);
    }
    updateFontFamily();
    $select.on('change', updateFontFamily);
  }
});
