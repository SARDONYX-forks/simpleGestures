import LibOption from '../lib_option';

/**
 * ジェスチャーを描画するキャンバス
 */
class ContentScripts {
  /**
   * @param {Object} trailCanvas
   * @constructor
   */
  constructor(trailCanvas) {
    this.infoDiv = null;
    this.commandDiv = null;
    this.actionNameDiv = null;
    this.trailCanvas = trailCanvas;
    this.option = new LibOption();
  }

  /**
   * Load option values.
   */
  loadOption() {
    chrome.runtime.sendMessage({msg: 'load_options'}, (response) => {
      if (response) {
        this.option.setRawStorageData(response.options_json);

        // reload setting for canvas.
        this.setCanvasStyle();
        this.createInfoDiv();
      }
    });
  }

  /**
   * キャンバスの描画スタイルを設定
   */
  setCanvasStyle() {
    this.trailCanvas.setLineStyle(this.option.getColorCode(),
        this.option.getLineWidth());
  }


  /**
   * create infomation div & update style.
   */
  createInfoDiv() {
    const createDivElement = (id) => {
      const divElement = document.createElement('div');
      divElement.id = id;
      return divElement;
    };

    if ( ! this.commandDiv) {
      this.commandDiv = createDivElement('gestureCommandDiv');
    }
    if ( ! this.actionNameDiv) {
      this.actionNameDiv = createDivElement('gestureActionNameDiv');
    }
    if ( ! this.infoDiv) {
      this.infoDiv = createDivElement('infoDiv');
      this.infoDiv.appendChild(this.commandDiv);
      this.infoDiv.appendChild(this.actionNameDiv);
    }

    const setWidth = 300;
    const setHeight = 80;

    // style setting.
    this.infoDiv.style.width = setWidth + 'px';
    this.infoDiv.style.height = setHeight + 'px';

    // center position.
    this.infoDiv.style.top = '0px';
    this.infoDiv.style.left = '0px';
    this.infoDiv.style.right = '0px';
    this.infoDiv.style.bottom = '0px';
    this.infoDiv.style.margin = 'auto';
    this.infoDiv.style.position = 'fixed';

    //	this.infoDiv.style.borderRadius = '3px';
    //	this.infoDiv.style.backgroundColor = '#FFFFEE';

    //	this.infoDiv.style.overflow = 'visible';
    //	this.infoDiv.style.overflow = 'block';
    this.infoDiv.style.textAlign = 'center';
    this.infoDiv.style.background = 'transparent';
    this.infoDiv.style.zIndex ='10001';

    this.infoDiv.style.fontFamily = 'Arial';
    this.infoDiv.style.fontSize = '30px';
    this.infoDiv.style.color = this.option.getColorCode();
    this.infoDiv.style.fontWeight = 'bold';
  }

  /**
   * @param {Object} lineParam
   * @param {string} commandName
   * @param {string} actionName
   */
  draw(lineParam, commandName, actionName) {
    if (this.option.isTrailOn()) {
      // append されているか調べる。document.getElementById で取得出来たらOK
      const canvasId = this.trailCanvas.getCanvasId();
      if (canvasId && document.getElementById(canvasId)) {
        this.trailCanvas.drawLine(
            lineParam.fromX, lineParam.fromY,
            lineParam.toX, lineParam.toY
        );
      }
    }

    if (this.infoDiv && document.getElementById(this.infoDiv.id)) {
      const $divAction = $('#' + this.actionNameDiv.id);
      if (this.option.isActionTextOn()) {
        $divAction.html((actionName != null) ? actionName : '');
      } else {
        $divAction.html('');
      }

      const $divCommand = $('#' + this.commandDiv.id);
      if (this.option.isCommandTextOn()) {
        commandName = this.replaceCommandToArrow(commandName);
        $divCommand.html(commandName);
      } else {
        $divCommand.html('');
      }
    }
  }

  /**
   * Run the selected action.
   *
   * @param {type} actionName
   * @return {undefined}
   */
  exeAction(actionName) {
    switch (actionName) {
      case 'back':
        window.history.back();
        break;

      case 'forward':
        window.history.forward();
        break;

      case 'stop':
        window.stop();
        break;

      case 'scroll_top':
        window.scrollTo(0, 0);
        break;

      case 'scroll_bottom':
        window.scrollTo(0, $(document).height());
        break;

      default:
        // なにもしない
        break;
    }
  }

  /**
   * ジェスチャコマンドを矢印表記に変換して返す D=>↓、U=>↑...
   * @param {string} actionName
   * @return {string}
   */
  replaceCommandToArrow(actionName) {
    if (actionName) {
      actionName = actionName.replace(/U/g, '<i class="flaticon-up-arrow"></i>');
      actionName = actionName.replace(/L/g, '<i class="flaticon-left-arrow"></i>');
      actionName = actionName.replace(/R/g, '<i class="flaticon-right-arrow"></i>');
      actionName = actionName.replace(/D/g, '<i class="flaticon-down-arrow"></i>');
    }

    return actionName;
  }
}

export default ContentScripts;

