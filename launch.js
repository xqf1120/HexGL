(function() {
  var $, a, bindSkinOptions, closeSkinModal, defaultControls, getWebGL, hasWebGL, init, openSkinModal, s, selectedSkin, skins, u, updateSkinLabel, _fn, _i, _len;

  $ = function(_) {
    return document.getElementById(_);
  };

  skins = {
    blue: {
      label: '蓝色',
      shipTexture: null
    },
    yellow: {
      label: '黄色',
      shipTexture: {
        low: 'textures/ships/feisar/diffuse-yellow-lightning.jpg',
        high: 'textures.full/ships/feisar/diffuse-yellow-lightning.jpg'
      }
    }
  };

  selectedSkin = 'blue';

  updateSkinLabel = function() {
    var option, options, _i, _len;
    $('s-skin').innerHTML = "更换皮肤：" + skins[selectedSkin].label;
    options = document.querySelectorAll('.skin-option');
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      option = options[_i];
      if (option.getAttribute('data-skin') === selectedSkin) {
        option.className = 'skin-option selected';
      } else {
        option.className = 'skin-option';
      }
    }
  };

  openSkinModal = function() {
    $('skin-modal').style.display = 'block';
    $('skin-modal').setAttribute('aria-hidden', 'false');
    return updateSkinLabel();
  };

  closeSkinModal = function() {
    if ($('skin-modal').contains(document.activeElement)) {
      document.activeElement.blur();
    }
    $('skin-modal').style.display = 'none';
    return $('skin-modal').setAttribute('aria-hidden', 'true');
  };

  bindSkinOptions = function() {
    var option, options, _i, _len, _results;
    options = document.querySelectorAll('.skin-option');
    _results = [];
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      option = options[_i];
      _results.push((function(option) {
        return option.onclick = function() {
          selectedSkin = option.getAttribute('data-skin');
          return updateSkinLabel();
        };
      })(option));
    }
    return _results;
  };

  init = function(controlType, quality, hud, godmode) {
    var hexGL, progressbar, skin;
    skin = skins[selectedSkin];
    hexGL = new bkcore.hexgl.HexGL({
      document: document,
      width: window.innerWidth,
      height: window.innerHeight,
      container: $('main'),
      overlay: $('overlay'),
      gameover: $('step-5'),
      quality: quality,
      difficulty: 0,
      hud: hud === 1,
      controlType: controlType,
      godmode: godmode,
      track: 'Cityscape',
      shipTexture: skin.shipTexture
    });
    window.hexGL = hexGL;
    progressbar = $('progressbar');
    return hexGL.load({
      onLoad: function() {
        console.log('LOADED.');
        hexGL.init();
        $('step-3').style.display = 'none';
        $('step-4').style.display = 'block';
        return hexGL.start();
      },
      onError: function(s) {
        return console.error("Error loading " + s + ".");
      },
      onProgress: function(p, t, n) {
        console.log("LOADED " + t + " : " + n + " ( " + p.loaded + " / " + p.total + " ).");
        return progressbar.style.width = "" + (p.loaded / p.total * 100) + "%";
      }
    });
  };

  u = bkcore.Utils.getURLParameter;

  defaultControls = bkcore.Utils.isTouchDevice() ? 1 : 0;

  s = [['controlType', ['键盘', '触屏', 'LEAP MOTION 体感', '手柄'], defaultControls, defaultControls, '控制方式：'], ['quality', ['低', '中', '高', '极高'], 3, 3, '画质：'], ['hud', ['关', '开'], 1, 1, '界面显示：'], ['godmode', ['关', '开'], 0, 1, '无敌模式：']];

  _fn = function(a) {
    var e, f, _ref;
    a[3] = (_ref = u(a[0])) != null ? _ref : a[2];
    e = $("s-" + a[0]);
    (f = function() {
      return e.innerHTML = a[4] + a[1][a[3]];
    })();
    return e.onclick = function() {
      return f(a[3] = (a[3] + 1) % a[1].length);
    };
  };

  for (_i = 0, _len = s.length; _i < _len; _i++) {
    a = s[_i];
    _fn(a);
  }

  bindSkinOptions();
  updateSkinLabel();

  $('s-skin').onclick = function() {
    return openSkinModal();
  };

  $('skin-close').onclick = function() {
    return closeSkinModal();
  };

  $('skin-backdrop').onclick = function() {
    return closeSkinModal();
  };

  $('step-2').onclick = function() {
    $('step-2').style.display = 'none';
    $('step-3').style.display = 'block';
    return init(s[0][3], s[1][3], s[2][3], s[3][3]);
  };

  $('step-5').onclick = function() {
    return window.location.reload();
  };

  $('s-credits').onclick = function() {
    $('step-1').style.display = 'none';
    return $('credits').style.display = 'block';
  };

  $('credits').onclick = function() {
    $('step-1').style.display = 'block';
    return $('credits').style.display = 'none';
  };

  hasWebGL = function() {
    var canvas, gl;
    gl = null;
    canvas = document.createElement('canvas');
    try {
      gl = canvas.getContext("webgl");
    } catch (_error) {}
    if (gl == null) {
      try {
        gl = canvas.getContext("experimental-webgl");
      } catch (_error) {}
    }
    return gl != null;
  };

  if (!hasWebGL()) {
    getWebGL = $('start');
    getWebGL.innerHTML = '当前环境不支持 WebGL';
    getWebGL.onclick = function() {
      return window.location.href = 'http://get.webgl.org/';
    };
  } else {
    $('start').onclick = function() {
      closeSkinModal();
      $('step-1').style.display = 'none';
      $('step-2').style.display = 'block';
      return $('step-2').style.backgroundImage = "url(css/help-" + s[0][3] + ".png)";
    };
  }

}).call(this);
