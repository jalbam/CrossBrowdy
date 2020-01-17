window['slcanvas'] = {};

slcanvas_onSilverlightLoad = function(sender, args) {
    var control = sender.getHost();

    control.loaded = true;
    // Stub-in the getContext method
    control.getContext = function(context) {
        return control.Content.HTMLCanvasElement.getContext(context);
    };
    // Run the "onload" code (if present)
    if (control.action) {
        control.action.call(control, control);
    }
}

// Standard onError method
slcanvas_onSilverlightError = function(sender, args) {
    var appSource = "";
    if (sender != null && sender != 0) {
        appSource = sender.getHost().Source;
    }

    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;

    if (errorType == "ImageError" || errorType == "MediaError") {
        return;
    }

    var errMsg = "Unhandled Error in Silverlight Application " + appSource + "\n";

    errMsg += "Code: " + iErrorCode + "    \n";
    errMsg += "Category: " + errorType + "       \n";
    errMsg += "Message: " + args.ErrorMessage + "     \n";

    if (errorType == "ParserError") {
        errMsg += "File: " + args.xamlFile + "     \n";
        errMsg += "Line: " + args.lineNumber + "     \n";
        errMsg += "Position: " + args.charPosition + "     \n";
    }
    else if (errorType == "RuntimeError") {
        if (args.lineNumber != 0) {
            errMsg += "Line: " + args.lineNumber + "     \n";
            errMsg += "Position: " + args.charPosition + "     \n";
        }
        errMsg += "MethodName: " + args.methodName + "     \n";
    }

    throw new Error(errMsg);
}

slcanvas.canvasHtmlStart =
    '<object data="data:application/x-silverlight-2," type="application/x-silverlight-2"';
slcanvas.canvasHtmlEnd =
    '>' +
        '<param name="source" value="SCRIPT_PATH' + CB_Configuration[CB_BASE_NAME].SLCANVAS_PATH + 'ClientBin/SLCanvas.xap"/>' +
		'<param name="onLoad" value="slcanvas_onSilverlightLoad"/>' +
        '<param name="onError" value="slcanvas_onSilverlightError"/>' +
        '<param name="background" value="Transparent"/>' +
        '<param name="windowless" value="true"/>' +
        '<param name="minRuntimeVersion" value="3.0.40624.0"/>' +
        '<param name="autoUpgrade" value="true"/>' +
        '<a href="http://go.microsoft.com/fwlink/?LinkID=149156&v=3.0.40624.0" style="text-decoration:none" target="_blank">' +
          //'<img src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="Get Microsoft Silverlight" style="border-style:none"/>' +
		  '<img src="SCRIPT_PATH' + CB_Configuration[CB_BASE_NAME].SLCANVAS_PATH + 'Silverlight.png" alt="Get Microsoft Silverlight" style="border-style:none"/>' +
        '</a>' +
    '</object>';

// Method that inserts a <canvas> into the page
slcanvas.writeCanvasDiv = function(id, width, height, action) {
    document.write('<div class="canvas">' + slcanvas.canvasHtmlStart + ' id="' + id + '" width="' + width + '" height="' + height + '"' + slcanvas.canvasHtmlEnd + "</div>");
    document.getElementById(id).action = action;
}

// Method that inserts a <canvas> into the page
slcanvas.writeCanvas = function(id, width, height, action) {
    var canvasTag = document.createElement('canvas');
    canvasTag.setAttribute('id', id);
    canvasTag.setAttribute('width', width);
    canvasTag.setAttribute('height', height);
    canvasTag.setAttribute('renderMethod', 'Silverlight');
    var tmp = document.createElement('div');
    tmp.appendChild(canvasTag);
    document.write(tmp.innerHTML);
    canvasTag = document.getElementById(id);
    slcanvas.setupSilverlightOnCanvasTag(canvasTag, id, action);
}

// Method that creats a <canvas> instance and returns it
slcanvas.createCanvasDiv = function(width, height, action) {
	var div = document.createElement("div");
    try
	{
		div.innerHTML = slcanvas.canvasHtmlStart + " width='" + width + "' height='" + height + "'" + slcanvas.canvasHtmlEnd.replace(/SCRIPT_PATH/g, CB_scriptPath);
		var obj = div.firstChild;
		obj.action = action;
		return obj;
	} catch (e) {}
    return div;
}

// auto-load canvas for renderMethod="Silverlight" attributed <canvas> tags
slcanvas.getBrowserNativelySupportsCanvas = function() {
    if (slcanvas.__supportsCanvas !== undefined) return slcanvas.__supportsCanvas;
    var testCanvas = document.createElement('canvas');
    slcanvas.__supportsCanvas = !(!(testCanvas['getContext']));
    return slcanvas.__supportsCanvas;
}

slcanvas.getBrowserCanSupportSlCanvas = function() {
    // todo
    return true;
}

slcanvas.autoLoad = function() {
    var canvasTags = document.getElementsByTagName('canvas');
    for (var i = 0; i < canvasTags.length; i++) {
        var canvasTag = canvasTags[i];
        var renderMethodAttrib = canvasTag.getAttribute('renderMethod');
        if (renderMethodAttrib) {
            renderMethodAttrib = renderMethodAttrib.toLowerCase();
            var saction = canvasTag.getAttribute('onload');
            if (renderMethodAttrib == 'silverlight' ||
                      (renderMethodAttrib == 'auto' &&
                      !slcanvas.getBrowserNativelySupportsCanvas() &&
                      slcanvas.getBrowserCanSupportSlCanvas())) {
                var id = slcanvas.getScriptId(canvasTag, canvasTag.getAttribute('id'));
                var action = null;
                if (saction && saction.length > 0) action = eval(id + '_onload = function(canvasEl) {' + saction + ';}');
                if (window[id + '_onload']) window[id + '_onload'] = undefined;
                slcanvas.setupSilverlightOnCanvasTag(canvasTag, id, action);
            } else if (slcanvas.getBrowserNativelySupportsCanvas() && (renderMethodAttrib == 'auto' || renderMethodAttrib == 'native')) {
                if (saction && saction.length > 0) action = eval(id + '_onload = function(canvasEl) {' + saction + ';}');
                if (window[id + '_onload']) window[id + '_onload'] = undefined;
                action.call(canvasTag);
            }
        }
    }
}

slcanvas.runAutoLoad = function() {
    var loadfpre = window.onload;
    var loadf = function() {
        if (loadfpre) loadfpre.call();
        slcanvas.autoLoad();
    };
    window.onload = loadf;
}

slcanvas.getScriptId = function(tagEl, scriptid) {
    if (!scriptid || scriptid.length == 0) {
        scriptid = tagEl.getAttribute('id');
        if (!scriptid || scriptid.length == 0) {
            var n = 1;
            scriptid = 'slcanvas';
            while (document.getElementById('scriptid' + n.toString())) n++;
            scriptid = scriptid + n.toString();
        }
    }
    return scriptid;
};

slcanvas.getContainerId = function(tagEl, scriptid) {
    scriptid = slcanvas.getScriptId(tagEl, scriptid);
    var ret = scriptid + '_container';
    if (document.getElementById(ret)) {
        var n = 1;
        while (document.getElementById(ret + n.toString())) n++;
        ret += n;
    }
    return ret;
};

slcanvas.setupSilverlightOnCanvasTag = function(canvasTag, id, action) {
    var isSetup = canvasTag.getAttribute('slIsSetup');
    if (isSetup == 'true') return;
    canvasTag = slcanvas.makeContainerElement(canvasTag);
    id = slcanvas.getScriptId(canvasTag, id);
    var containerId = slcanvas.getContainerId(canvasTag, id);
    canvasTag.setAttribute('id', containerId);
    var width = canvasTag.getAttribute('width');
    if (!width) width = 300;
    var height = canvasTag.getAttribute('height');
    if (!height) height = 150;
    canvasTag.innerHTML = slcanvas.canvasHtmlStart + ' id="' + id + '" width="' + width + '" height="' + height + '"' + slcanvas.canvasHtmlEnd;
    canvasTag.setAttribute('slIsSetup', 'true');
    if (action) {
        var renderer = document.getElementById(id);
        renderer.action = action;
        if (renderer['loaded']) renderer.action.call(renderer, renderer);
    }
}

slcanvas.makeContainerElement = function(el) {
    if (!el) return null;
    var innerHTML = el.innerHTML;
    try {
        el.innerHTML = innerHTML;
        if (!slcanvas.getBrowserNativelySupportsCanvas()) return el;
    } catch (error) { }

    // capture attribs
    var oattribs = el.attributes;
    var attribs = {};
    var len = oattribs.length;
    for (var a = 0; a < len; a++) {
        attribs[oattribs.item(a).nodeName] = oattribs.item(a).nodeValue;
    }

    // find the end-canvas tag
    var endCanvas = el.nextSibling;
    while (endCanvas) {
        if (endCanvas.tagName && endCanvas.tagName.toLowerCase() == '/canvas') break;
        endCanvas = endCanvas.nextSibling;
    }

    // find the appropriate tag to prepend or append
    var nextSibling = (endCanvas ? endCanvas.nextSibling : el.nextSibling);
    var parentEl = el.parentElement ? el.parentElement : el.parentNode;

    // drop the existing tag
    var endTagPrevSib = endCanvas ? endCanvas.previousSibling : null;
    if (endCanvas) parentEl.removeChild(endCanvas);
    while (endTagPrevSib && endTagPrevSib != el) {
        var prevup = endTagPrevSib.previousSibling;
        parentEl.removeChild(endTagPrevSib);
        endTagPrevSib = prevup;
    }
    parentEl.removeChild(el);

    // create the new tag 
    var containerTag = 'canvas';
    if (slcanvas.getBrowserNativelySupportsCanvas()) containerTag = 'div';
    el = document.createElement(containerTag);
    for (var a in attribs) {
        var attrib = document.createAttribute(a);
        attrib.value = attribs[a];
        try {
            el.attributes.setNamedItem(attrib);
        } catch (error) { } // IE6 will pull in extra junk that can't be set
    }
    //el.innerHTML = innerHTML;

    // add new tag
    if (nextSibling) parentEl.insertBefore(el, nextSibling);
    else parentEl.appendChild(el);

    return el;
};

slcanvas.runAutoLoad();
slcanvas.autoLoad();