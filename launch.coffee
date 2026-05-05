$ = (_) -> document.getElementById _

skins =
  blue:
    label: '蓝色'
    shipTexture: null
  yellow:
    label: '黄色'
    shipTexture:
      low: 'textures/ships/feisar/diffuse-yellow-lightning.jpg'
      high: 'textures.full/ships/feisar/diffuse-yellow-lightning.jpg'

selectedSkin = 'blue'

updateSkinLabel = ->
  $('s-skin').innerHTML = "更换皮肤：#{skins[selectedSkin].label}"
  options = document.querySelectorAll '.skin-option'
  for option in options
    if option.getAttribute('data-skin') is selectedSkin
      option.className = 'skin-option selected'
    else
      option.className = 'skin-option'

openSkinModal = ->
  $('skin-modal').style.display = 'block'
  $('skin-modal').setAttribute 'aria-hidden', 'false'
  updateSkinLabel()

closeSkinModal = ->
  if $('skin-modal').contains document.activeElement
    document.activeElement.blur()
  $('skin-modal').style.display = 'none'
  $('skin-modal').setAttribute 'aria-hidden', 'true'

bindSkinOptions = ->
  options = document.querySelectorAll '.skin-option'
  for option in options
    do (option) ->
      option.onclick = ->
        selectedSkin = option.getAttribute 'data-skin'
        updateSkinLabel()

init = (controlType, quality, hud, godmode) ->
  skin = skins[selectedSkin]
  hexGL = new bkcore.hexgl.HexGL(
    document: document
    width: window.innerWidth
    height: window.innerHeight
    container: $ 'main'
    overlay: $ 'overlay'
    gameover: $ 'step-5'
    quality: quality
    difficulty: 0
    hud: hud is 1
    controlType: controlType
    godmode: godmode
    track: 'Cityscape'
    shipTexture: skin.shipTexture
  )
  window.hexGL = hexGL

  progressbar = $ 'progressbar'
  hexGL.load(
    onLoad: ->
      console.log 'LOADED.'
      hexGL.init()
      $('step-3').style.display = 'none'
      $('step-4').style.display = 'block'
      hexGL.start()
    onError: (s) ->
      console.error "Error loading #{ s }."
    onProgress: (p, t, n) ->
      console.log("LOADED #{t} : #{n} ( #{p.loaded} / #{p.total} ).")
      progressbar.style.width = "#{ p.loaded / p.total * 100 }%"
  )

u = bkcore.Utils.getURLParameter

defaultControls = if bkcore.Utils.isTouchDevice() then 1 else 0

s = [
  ['controlType', ['键盘', '触屏', 'LEAP MOTION 体感',
    '手柄'], defaultControls, defaultControls, '控制方式：']
  ['quality', ['低', '中', '高', '极高'], 3, 3, '画质：']
  ['hud', ['关', '开'], 1, 1, '界面显示：']
  ['godmode', ['关', '开'], 0, 1, '无敌模式：']
]

for a in s
  do (a) ->
    a[3] = u(a[0]) ? a[2]
    e = $ "s-#{a[0]}"
    (f = -> e.innerHTML = a[4] + a[1][a[3]])()
    e.onclick = -> f(a[3] = (a[3] + 1) % a[1].length)

bindSkinOptions()
updateSkinLabel()

$('s-skin').onclick = ->
  openSkinModal()

$('skin-close').onclick = ->
  closeSkinModal()

$('skin-backdrop').onclick = ->
  closeSkinModal()

$('step-2').onclick = ->
  $('step-2').style.display = 'none'
  $('step-3').style.display = 'block'
  init s[0][3], s[1][3], s[2][3], s[3][3]

$('step-5').onclick = ->
  window.location.reload()

$('s-credits').onclick = ->
  $('step-1').style.display = 'none'
  $('credits').style.display = 'block'

$('credits').onclick = ->
  $('step-1').style.display = 'block'
  $('credits').style.display = 'none'

hasWebGL = ->
  gl = null
  canvas = document.createElement('canvas')
  try
    gl = canvas.getContext("webgl")
  if not gl?
    try
      gl = canvas.getContext("experimental-webgl")
  return gl?

if not hasWebGL()
  getWebGL = $('start')
  getWebGL.innerHTML = '当前环境不支持 WebGL'
  getWebGL.onclick = ->
    window.location.href = 'http://get.webgl.org/'
else
  $('start').onclick = ->
    closeSkinModal()
    $('step-1').style.display = 'none'
    $('step-2').style.display = 'block'
    $('step-2').style.backgroundImage = "url(css/help-#{s[0][3]}.png)"
